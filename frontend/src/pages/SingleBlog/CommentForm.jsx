const CommentForm = ({ comment, setComment, onSubmit }) => (
  <form onSubmit={onSubmit} className="mb-6">
    <textarea
      value={comment}
      onChange={e => setComment(e.target.value)}
      placeholder="Add a comment..."
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
      rows="3"
      style={{ resize: "none" }}
    />
    <button
      type="submit"
      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Post Comment
    </button>
  </form>
);
export default CommentForm;