const AuthorInfo = ({ author }) => {
  if (!author) return null;
  return (
    <div className="flex items-center border-t pt-6">
      <img
        src={author.displayPicture || "/default-avatar.png"}
        alt={author.username}
        className="h-12 w-12 rounded-full object-cover"
        onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
      />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-900">
          {author.username?.toString().toUpperCase()}
        </p>
        <p className="text-sm text-gray-500">{author.role}</p>
      </div>
    </div>
  );
};
export default AuthorInfo;