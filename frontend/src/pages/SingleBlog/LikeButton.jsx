const LikeButton = ({ isLiked, likeCount, onLike }) => (
  <button
    onClick={onLike}
    className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500 transition-colors`}
  >
    <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
    <span>{likeCount}</span>
  </button>
);
export default LikeButton;