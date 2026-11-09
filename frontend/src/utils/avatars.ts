// Predefined avatar options
export const avatarOptions = [
  { id: 1, emoji: '😀', name: 'Gülen', color: 'from-yellow-400 to-orange-500' },
  { id: 2, emoji: '😎', name: 'Havalı', color: 'from-blue-400 to-blue-600' },
  { id: 3, emoji: '🤓', name: 'Bilge', color: 'from-green-400 to-green-600' },
  { id: 4, emoji: '😊', name: 'Mutlu', color: 'from-pink-400 to-pink-600' },
  { id: 5, emoji: '🥳', name: 'Kutlama', color: 'from-purple-400 to-purple-600' },
  { id: 6, emoji: '🤩', name: 'Yıldız', color: 'from-yellow-500 to-red-500' },
  { id: 7, emoji: '😇', name: 'Melek', color: 'from-cyan-400 to-blue-500' },
  { id: 8, emoji: '🧐', name: 'Düşünceli', color: 'from-gray-400 to-gray-600' },
  { id: 9, emoji: '🎭', name: 'Sanatçı', color: 'from-indigo-400 to-purple-600' },
  { id: 10, emoji: '🎬', name: 'Sinema', color: 'from-red-500 to-red-700' },
  { id: 11, emoji: '📚', name: 'Kitap', color: 'from-teal-400 to-teal-600' },
  { id: 12, emoji: '🎨', name: 'Sanat', color: 'from-orange-400 to-red-500' },
  { id: 13, emoji: '🎵', name: 'Müzik', color: 'from-purple-500 to-pink-500' },
  { id: 14, emoji: '🌟', name: 'Parlak', color: 'from-yellow-300 to-yellow-500' },
  { id: 15, emoji: '🔥', name: 'Ateşli', color: 'from-orange-500 to-red-600' },
  { id: 16, emoji: '💎', name: 'Değerli', color: 'from-cyan-300 to-blue-400' },
];

export const getAvatarById = (id: number) => {
  return avatarOptions.find(avatar => avatar.id === id) || avatarOptions[0];
};

export const getDefaultAvatar = () => avatarOptions[0];
