import { getAvatarById, getDefaultAvatar } from '../utils/avatars';

interface AvatarProps {
  avatar_id?: number;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar = ({ avatar_id, username, size = 'md', className = '' }: AvatarProps) => {
  const avatar = avatar_id ? getAvatarById(avatar_id) : getDefaultAvatar();

  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-24 h-24 text-4xl',
    xl: 'w-32 h-32 text-5xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br ${avatar.color} rounded-full flex items-center justify-center font-bold shadow-lg ${className}`}
      title={avatar.name}
    >
      <span>{avatar.emoji}</span>
    </div>
  );
};

export default Avatar;
