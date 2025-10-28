import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./HomeContent.css";

interface Post {
  id: string;
  author: {
    name: string;
    division: string;
    avatar: string;
  };
  date: string;
  title: string;
  hashtags: string[];
  content: string;
  image?: string;
}

const HomeContent = () => {
  const posts: Post[] = [
    {
      id: "1",
      author: {
        name: "Moriee al haji",
        division: "Nama_Divisi",
        avatar: "/placeholder.svg",
      },
      date: "23 Nov 2025",
      title: "Cara Membuat Telur Gulung",
      hashtags: ["#Telur Gulu", "#makanan"],
      content:
        "Misi kami di Cookpad adalah untuk membuat masak sehari-hari menyenangkan, karena kami percaya bahwa memasak adalah kunci menuju kehidupan yang lebih bahagia dan lebih sehat bagi manusia, komunitas, dan bumi .......",
    },
    {
      id: "2",
      author: {
        name: "Netta muji maju",
        division: "Nama_Divisi",
        avatar: "/placeholder.svg",
      },
      date: "23 Nov 2025",
      title: "PEMBUATAN IOT BERBASIS AI",
      hashtags: ["#AI", "#IOT", "#Tanaman"],
      content: "",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      author: {
        name: "Regina alhajiz",
        division: "Nama_Divisi",
        avatar: "/placeholder.svg",
      },
      date: "23 Nov 2025",
      title: "Menghapus Postingan dari akun",
      hashtags: [],
      content: "",
    },
  ];

  return (
    <div className="home-content">
      <h1 className="home-greeting">Hello, Gideon</h1>

      <div className="posts-container">
        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <Avatar className="post-avatar">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>
                    {post.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="post-author-name">{post.author.name}</p>
                  <p className="post-author-division">{post.author.division}</p>
                </div>
              </div>
              <span className="post-date">{post.date}</span>
            </div>

            <h2 className="post-title">{post.title}</h2>

            {post.hashtags.length > 0 && (
              <p className="post-hashtags">{post.hashtags.join(" ")}</p>
            )}

            {post.content && <p className="post-content">{post.content}</p>}

            {post.image && (
              <div className="post-image-container">
                <img src={post.image} alt={post.title} className="post-image" />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
