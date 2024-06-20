
interface CategoryCardProps {
  name: string;
  thumbnail: string;
  titleImage: string;
  zIndex?: number;
  isActive?: boolean;
  onClick?: () => void;
}
export function CategoryCard({ isActive, name, thumbnail, titleImage, zIndex, onClick}:  CategoryCardProps) {
  return  isActive ? 
    (<div className="flex justify-around p-8 cursor-pointer rounded-lg" 
    onClick={onClick}
    style={{
      width: "250px",
      height: "150px",
      boxShadow: "0 0 20px rgba(254, 201, 11, 0.96)",
      backgroundColor: "#ffffff",
      zIndex: 100,

    }}>
      <img src={thumbnail} />
      <div className="flex flex-col">
        <img src={titleImage} className="w-32" />
        <span>{name}</span>
      </div>
    </div>) : (<div className="-ml-[15px] flex justify-around p-8 cursor-pointer rounded-lg" onClick={onClick}
     style={{
      width: "220px",
      height: "130px",
      boxShadow: "0 0 20px rgba(225, 134, 132, 0.5)",
      backgroundColor: "#ffffff",
      zIndex,
    }}>
      <img src={thumbnail} />
      <div className="flex flex-col">
        <img src={titleImage} className="w-32" />
        <span>{name}</span>
      </div>
    </div>)
}