import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, followUser, unfollowUser, getFollowers, getFollowing, updateUserProfile } from '../services/user.service';
import { getListItemsByType, getUserCustomLists, createCustomList } from '../services/library.service';
import { getUserActivities } from '../services/feed.service';
import type { User, Content, List, Activity } from '../types';
import { ListType } from '../types';
import ContentCard from '../components/ContentCard';
import ActivityCard from '../components/ActivityCard';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import Avatar from '../components/Avatar';
import { avatarOptions, getAvatarById, getDefaultAvatar } from '../utils/avatars';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [activeTab, setActiveTab] = useState<'watched' | 'to_watch' | 'read' | 'to_read' | 'custom' | 'activities'>('watched');
  const [listItems, setListItems] = useState<Content[]>([]);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({ bio: '', avatar_id: getDefaultAvatar().id });
  const [newListForm, setNewListForm] = useState({ name: '', description: '' });

  const userId = parseInt(id || '0');
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    loadProfileData();
  }, [id]);

  useEffect(() => {
    loadTabContent();
  }, [activeTab, id]);

  const loadProfileData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const profile = await getUserProfile(userId);
      setProfileUser(profile ?? null);

      // Load bio and avatar for edit form
      if (profile && isOwnProfile) {
        setEditForm({
          bio: profile.bio || '',
          avatar_id: (profile as any).avatar_id || getDefaultAvatar().id
        });
      }

      // Get follower/following counts
      const followers = await getFollowers(userId);
      const following = await getFollowing(userId);
      setFollowerCount(followers.length);
      setFollowingCount(following.length);

      // Check if current user is following this profile
      if (currentUser && !isOwnProfile) {
        // Check if profile response has is_following field
        if (profile && 'is_following' in profile) {
          setIsFollowing((profile as any).is_following);
        } else {
          // Fallback: check if current user is in the following list
          const following = await getFollowing(currentUser.id);
          const isFollowingUser = following.some((f: any) => f.following_id === userId);
          setIsFollowing(isFollowingUser);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTabContent = async () => {
    if (!userId) return;

    try {
      if (activeTab === 'custom') {
        const lists = await getUserCustomLists(userId);
        setCustomLists(lists);
      } else if (activeTab === 'activities') {
        const userActivities = await getUserActivities(userId);
        setActivities(userActivities);
      } else {
        const items = await getListItemsByType(userId, activeTab as ListType);
        setListItems(items || []);
      }
    } catch (error) {
      console.error('Error loading tab content:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!userId) return;

    // If already following, show confirmation modal
    if (isFollowing) {
      setShowUnfollowModal(true);
      return;
    }

    // Otherwise, follow directly
    try {
      await followUser(userId);
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
      toast.success(`${profileUser?.username} takip edildi!`);
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Takip edilemedi');
    }
  };

  const handleUnfollowConfirm = async () => {
    if (!userId) return;

    try {
      await unfollowUser(userId);
      setIsFollowing(false);
      setFollowerCount(prev => prev - 1);
      setShowUnfollowModal(false);
      toast.success(`${profileUser?.username} takipten çıkarıldı`);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Takipten çıkarılamadı');
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const updatedUser = await updateUserProfile({ bio: editForm.bio, avatar_id: editForm.avatar_id });
      setProfileUser(updatedUser);
      setShowEditProfileModal(false);
      toast.success('Profil güncellendi!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil güncellenemedi');
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListForm.name.trim()) {
      toast.error('Liste adı gereklidir');
      return;
    }

    try {
      await createCustomList(newListForm.name, newListForm.description);
      setShowCreateListModal(false);
      setNewListForm({ name: '', description: '' });
      toast.success('Özel liste oluşturuldu!');
      // Reload custom lists
      if (activeTab === 'custom') {
        loadTabContent();
      }
    } catch (error) {
      console.error('Error creating list:', error);
      toast.error('Liste oluşturulamadı');
    }
  };

  const handleShowFollowers = async () => {
    if (!userId) return;
    try {
      const followers = await getFollowers(userId);
      setFollowersList(followers);
      setShowFollowersModal(true);
    } catch (error) {
      console.error('Error loading followers:', error);
      toast.error('Takipçiler yüklenemedi');
    }
  };

  const handleShowFollowing = async () => {
    if (!userId) return;
    try {
      const following = await getFollowing(userId);
      setFollowingList(following);
      setShowFollowingModal(true);
    } catch (error) {
      console.error('Error loading following:', error);
      toast.error('Takip edilenler yüklenemedi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-purple-500 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-white text-lg">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-white text-lg">Kullanıcı bulunamadı</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'watched', label: 'İzlenenler' },
    { id: 'to_watch', label: 'İzlenecekler' },
    { id: 'read', label: 'Okunanlar' },
    { id: 'to_read', label: 'Okunacaklar' },
    { id: 'custom', label: 'Özel Listeler' },
    { id: 'activities', label: 'Aktiviteler' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950">
      <Navbar />

      {/* Profile Header with Cover */}
      <div className="relative pt-16">
        {/* Cover Background */}
        <div className="absolute inset-0 h-80 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar with Ring */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative">
                <Avatar
                  avatar_id={(profileUser as any).avatar_id}
                  username={profileUser.username}
                  size="xl"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {profileUser.username}
              </h1>
              {profileUser.bio && (
                <p className="text-lg text-gray-300 mb-4 max-w-2xl">{profileUser.bio}</p>
              )}

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <button
                  onClick={handleShowFollowers}
                  className="group hover:scale-105 transition-transform"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {followerCount}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">Takipçi</div>
                  </div>
                </button>
                <button
                  onClick={handleShowFollowing}
                  className="group hover:scale-105 transition-transform"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                      {followingCount}
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-pink-400 transition-colors">Takip</div>
                  </div>
                </button>
              </div>

              {/* Actions */}
              {isOwnProfile ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 font-medium transition-all border border-white/20 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Profili Düzenle
                  </button>
                  <button
                    onClick={() => setShowCreateListModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-medium transition-all shadow-lg shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Liste
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg ${
                    isFollowing
                      ? 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-purple-500/50'
                  }`}
                >
                  {isFollowing ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Takip Ediliyor
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Takip Et
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 sticky top-16 bg-black/80 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'activities' ? (
          activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-400 text-lg">Henüz aktivite yok</p>
              <p className="text-gray-500 text-sm mt-2">İçerik ekle, puan ver veya yorum yap!</p>
            </div>
          )
        ) : activeTab === 'custom' ? (
          customLists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customLists.map((list) => (
                <div key={list.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-xl mb-2 group-hover:text-purple-400 transition-colors">{list.name}</h3>
                  {list.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{list.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400 text-lg">Özel liste yok</p>
              <p className="text-gray-500 text-sm mt-2">Favori içeriklerini organize etmek için liste oluştur!</p>
            </div>
          )
        ) : (
          listItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {listItems.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400 text-lg">Bu listede henüz içerik yok</p>
              <p className="text-gray-500 text-sm mt-2">İçerik keşfet ve listene ekle!</p>
            </div>
          )
        )}
      </main>

      {/* Unfollow Confirmation Modal */}
      <ConfirmModal
        isOpen={showUnfollowModal}
        title="Takipten Çık"
        message={`${profileUser?.username} kullanıcısını takipten çıkarmak istediğinize emin misiniz?`}
        confirmText="Takipten Çık"
        cancelText="İptal"
        onConfirm={handleUnfollowConfirm}
        onCancel={() => setShowUnfollowModal(false)}
        isDangerous
      />

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 border border-white/20 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-500">●</span> Profili Düzenle
              </h2>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditProfile}>
              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Avatar
                </label>
                <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, avatar_id: avatar.id })}
                      className={`aspect-square rounded-xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-3xl transition-all hover:scale-110 ${
                        editForm.avatar_id === avatar.id
                          ? 'ring-4 ring-purple-500 ring-offset-2 ring-offset-transparent scale-110 shadow-lg shadow-purple-500/50'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={avatar.name}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biyografi
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Kendiniz hakkında birkaç şey yazın..."
                  className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 transition-all"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {editForm.bio.length}/200 karakter
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 font-medium transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-medium transition-all shadow-lg shadow-purple-500/50"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-lg w-full border border-white/20 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-500">●</span> Takipçiler
                <span className="text-lg text-gray-400 font-normal">({followersList.length})</span>
              </h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {followersList.length > 0 ? (
              <div className="space-y-3">
                {followersList.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all hover:scale-[1.02] border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        avatar_id={follower.avatar_id}
                        username={follower.username}
                        size="sm"
                      />
                      <div>
                        <a
                          href={`/profile/${follower.id}`}
                          className="font-medium text-white hover:text-purple-400 transition-colors"
                        >
                          {follower.username}
                        </a>
                        {follower.bio && (
                          <p className="text-sm text-gray-400 truncate max-w-xs">{follower.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-xl">
                <div className="text-6xl mb-3">👥</div>
                <p className="text-gray-400">Henüz takipçi yok</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-lg w-full border border-white/20 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-500">●</span> Takip Edilenler
                <span className="text-lg text-gray-400 font-normal">({followingList.length})</span>
              </h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {followingList.length > 0 ? (
              <div className="space-y-3">
                {followingList.map((following) => (
                  <div key={following.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all hover:scale-[1.02] border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        avatar_id={following.avatar_id}
                        username={following.username}
                        size="sm"
                      />
                      <div>
                        <a
                          href={`/profile/${following.id}`}
                          className="font-medium text-white hover:text-purple-400 transition-colors"
                        >
                          {following.username}
                        </a>
                        {following.bio && (
                          <p className="text-sm text-gray-400 truncate max-w-xs">{following.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-xl">
                <div className="text-6xl mb-3">🔍</div>
                <p className="text-gray-400">Kimse takip edilmiyor</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Custom List Modal */}
      {showCreateListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Yeni Özel Liste Oluştur</h2>
            <form onSubmit={handleCreateList}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Liste Adı *
                </label>
                <input
                  type="text"
                  value={newListForm.name}
                  onChange={(e) => setNewListForm({ ...newListForm, name: e.target.value })}
                  placeholder="Örn: En İyi Bilimkurgu Filmlerim"
                  className="w-full px-4 py-3 bg-black text-white border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                  maxLength={100}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={newListForm.description}
                  onChange={(e) => setNewListForm({ ...newListForm, description: e.target.value })}
                  placeholder="Bu liste hakkında kısa bir açıklama..."
                  className="w-full px-4 py-3 bg-black text-white border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateListModal(false);
                    setNewListForm({ name: '', description: '' });
                  }}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
