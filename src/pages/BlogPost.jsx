import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";

const BlogPost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const postId = searchParams.get("id");

  // Mock data for posts (same as in HomeContent)
  const posts = [
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

  const currentPost = posts.find(post => post.id === postId);

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  const post = currentPost || {
    author: {
      name: "Moriee al haji",
      division: "Nama_Divisi",
      avatar: "/placeholder.svg",
    },
    date: "28 November 2025",
    time: "19.00 WIB",
    title: "CARA MEMBUAT TELUR GULUNG",
    hashtags: ["#Telur Gulu", "#makanan"],
    content: `1. Siap kan wadah, pecahkan telur ke dalam wadah lalu campur dengan garam dan penyedap. Kocok telur hingga rata.
2. Dalam gelas berisi air, masukan tepung tapioka/sagu lalu aduk.
3. Tuang air yang sudah dicampur tepung tapioka/sagu kedalam kocokan telur. Aduk lagi hingga semua bahan tercampur.
4. Panas kan wajan dengan minyak banyak (minyak harus banyak ya, supaya telur bisa kering dan tidak menjadi telur dadar hehehe). Tunggu sampai minyak benar2 panas.
5. Masukkan 1 centong sayur adonan telur kedalam wajan, usahan jarak penungan telur agak tinggi dari minyak, sekitar 15-20cm diatas minyak (ini sangat disarankan untuk pemula, supaya anti gagal). Tunggu 5 detik, setelah itu gulung telur menggunakan tusuk sate (cukup ditarik dari pinggir wajan). Jika metodenya sudah benar saat menggulung tidak akan susah, Karena nanti telur akan tertarik sendiri mengikuti arah gulungan.
6. Setelah telur sudah menempel sempurna ditusuk sate, padatkan lagi dengan cara ditekan2 ke pinggir wajan. Gunanya supaya mengurangi minyak dan membuat gulungan telur menjadi padat.
7. Selamat mencoba ❤️`,
  };

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        recentProjects={recentProjects}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-foreground">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">{post.author.division}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{post.date}</p>
                    <p>19.00 WIB</p>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4 text-foreground">{post.title}</h1>

                {post.hashtags && post.hashtags.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {post.hashtags.join(" ")}
                  </p>
                )}

                <div className="prose prose-lg max-w-none text-foreground">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {post.document && (
                  <div className="mt-6 p-4 bg-background/50 rounded-lg flex items-center gap-3">
                    <FileText className="h-6 w-6 text-destructive" />
                    <span className="text-sm text-foreground">{post.document}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
