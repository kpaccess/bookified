import { auth } from "@clerk/nextjs/server";
import HeroSection from "@/components/HeroSection";
import { sampleBooks } from "@/lib/constants";
import BookCard from "@/components/BookCard";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="wrapper container">
      <HeroSection addBookHref={userId ? "/books/new" : "/sign-in"} />
      <div className="library-books-grid">
        {sampleBooks.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </main>
  );
}
