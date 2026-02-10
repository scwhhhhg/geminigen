export default function Page() {
  const images = []; // load from KV / JSON

  return (
    <main className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {images.map((img) => (
        <div key={img.id} className="rounded-xl overflow-hidden">
          {img.imageUrl ? (
            <img src={img.imageUrl} className="w-full h-auto" />
          ) : (
            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center text-sm">
              Generating...
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
