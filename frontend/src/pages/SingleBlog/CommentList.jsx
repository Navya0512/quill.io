const CommentList = ({ comments, user, onDelete }) => (
  <div className="space-y-4">
    {comments.length === 0 ? (
      <p className="text-gray-500">No comments yet</p>
    ) : (
      comments.map(comment => (
        <div key={comment._id} className="border-b pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <img
                src={comment.userId?.displayPicture || "/default-avatar.png"}
                alt={comment.userId?.username}
                className="h-8 w-8 rounded-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{comment.userId?.username}</p>
                <p className="text-xs text-gray-500">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Date unavailable"}
                </p>
              </div>
            </div>
            {user && (user.role === "admin" || comment.userId?._id === user._id) && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-red-600 hover:text-red-800 text-sm flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            )}
          </div>
          <p className="text-gray-700">{comment.comment}</p>
        </div>
      ))
    )}
  </div>
);
export default CommentList;