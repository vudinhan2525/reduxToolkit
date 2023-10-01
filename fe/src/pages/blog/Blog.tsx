import CreatePost from "./CreatePost";
import PostList from "./PostList";
function Blog() {
  return (
    <div className="p-5">
      <CreatePost />
      <div>
        <PostList />
      </div>
    </div>
  );
}

export default Blog;
