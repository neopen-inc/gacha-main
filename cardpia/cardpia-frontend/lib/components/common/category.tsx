
interface CategoryCardProps {
  name: string;
  thumbnail: string;
  titleImage: string;
  zIndex?: number;
  isActive?: boolean;
  onClick?: () => void;
}
export function CategoryCard({ isActive, name, thumbnail, titleImage, zIndex, onClick}:  CategoryCardProps) {
  return  <div className={`flex justify-around p-8 cursor-pointer rounded-lg border-2 ${isActive ? " border-primary" : "border-gray-500"}`}
    onClick={onClick}
    style={{
      backgroundColor: "#ffffff",
      zIndex: 100,
    }}>
      <img src={thumbnail} />
      <div className="flex flex-col">
        <img src={titleImage} className="w-32" />
      </div>
    </div>
}