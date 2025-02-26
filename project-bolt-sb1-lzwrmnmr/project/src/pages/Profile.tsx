import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Camera, ArrowLeft,
  Building, Briefcase, FileText, Bell, Shield, Trash2, Image
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile as ProfileType } from '../types/database';
import toast from 'react-hot-toast';

interface ProfileProps {
  onNavigateBack: () => void;
}

export default function Profile({ onNavigateBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<ProfileType>>({
    full_name: '',
    display_name: '',
    professional_title: '',
    phone: '',
    address: '',
    company: '',
    area_of_expertise: '',
    bio: '',
    notification_preferences: {
      email: true,
      push: true
    }
  });
  const [userEmail, setUserEmail] = useState('');
  const [farms, setFarms] = useState([]);
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchFarms();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      setUserEmail(user.email || '');

      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        const newProfile = {
          user_id: user.id,
          full_name: user.email?.split('@')[0] || 'Usuário',
          notification_preferences: {
            email: true,
            push: true
          }
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        data = createdProfile;
      }

      setProfile(data);
      if (data.cover_image) {
        setCoverImage(data.cover_image);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    }
  };

  const fetchFarms = async () => {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFarms(data || []);
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
      toast.error('Erro ao atualizar foto de perfil');
    }
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/cover-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_image: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setCoverImage(publicUrl);
      toast.success('Imagem de capa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar imagem de capa:', error);
      toast.error('Erro ao atualizar imagem de capa');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Conta excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      toast.error('Erro ao excluir conta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="space-y-6">
          {/* Cabeçalho do Perfil com Capa */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Capa do perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600" />
              )}
              
              {isEditing && (
                <label className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Alterar capa</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageUpload}
                  />
                </label>
              )}

              <div className="absolute -bottom-16 left-6 flex items-end gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors cursor-pointer">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  )}
                </div>
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-white">
                    {profile.display_name || profile.full_name}
                  </h1>
                  <p className="text-green-100">{profile.professional_title}</p>
                </div>
              </div>
            </div>

            <div className="pt-20 px-6 pb-6">
              <div className="flex justify-end mb-6">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-70"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg"
                  >
                    Editar Perfil
                  </button>
                )}
              </div>

              {/* Informações Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informações Pessoais
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Nome Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="text-gray-800 dark:text-gray-200">
                        {profile.full_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Nome de Exibição
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.display_name || ''}
                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="text-gray-800 dark:text-gray-200">
                        {profile.display_name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </label>
                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <Mail className="w-5 h-5 text-gray-400" />
                      {userEmail}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Telefone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Phone className="w-5 h-5 text-gray-400" />
                        {profile.phone}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informações Profissionais
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Cargo/Função
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.professional_title || ''}
                        onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        {profile.professional_title}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Empresa/Propriedade
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.company || ''}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Building className="w-5 h-5 text-gray-400" />
                        {profile.company}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Área de Atuação
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.area_of_expertise || ''}
                        onChange={(e) => setProfile({ ...profile, area_of_expertise: e.target.value })}
                        className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <FileText className="w-5 h-5 text-gray-400" />
                        {profile.area_of_expertise}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Biografia */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sobre
                </h2>
                {isEditing ? (
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500/50 dark:bg-gray-700 dark:text-white"
                    placeholder="Conte um pouco sobre você e sua experiência..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">
                    {profile.bio || 'Nenhuma biografia adicionada.'}
                  </p>
                )}
              </div>

              {/* Notificações */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preferências de Notificação
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profile.notification_preferences?.email}
                      onChange={(e) => setProfile({
                        ...profile,
                        notification_preferences: {
                          ...profile.notification_preferences,
                          email: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Receber notificações por email
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profile.notification_preferences?.push}
                      onChange={(e) => setProfile({
                        ...profile,
                        notification_preferences: {
                          ...profile.notification_preferences,
                          push: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Receber notificações push
                    </span>
                  </label>
                </div>
              </div>

              {/* Fazendas Vinculadas */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Fazendas Vinculadas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {farms.map((farm: any) => (
                    <div
                      key={farm.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {farm.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {farm.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {farm.area} hectares
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configurações da Conta */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configurações da Conta
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={() => {/* Implementar alteração de senha */}}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Shield className="w-5 h-5" />
                    Alterar Senha
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                    Excluir Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}