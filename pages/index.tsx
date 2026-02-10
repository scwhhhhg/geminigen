export default function Home({ images }) {
  return (
    <div className="columns-2 md:columns-4 gap-4 p-4">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          className="mb-4 rounded-xl hover:scale-105 transition"
        />
      ))}
    </div>
  );
}
