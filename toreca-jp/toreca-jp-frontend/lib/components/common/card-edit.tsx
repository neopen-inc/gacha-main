import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardContent, CardMedia } from "@mui/material";

interface CardEditProps {
  thumbnail: string;
  name: string;
  inventory: number;
  grade: string;
  rarity: string;
  probability?: number;
  initialInventory: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardEdit({ thumbnail, name, rarity, probability, grade, onEdit, onDelete }: CardEditProps) {
  return <Card className="flex w-full max-w-[48rem]">
      <CardMedia
        component="img"
        sx={{ width: 200 }}
        className={"aspect-auto"}
        image={thumbnail}
      />
    <CardContent className="flex flex-col flex-wrap space-between justify-items-stretch	grow">
    <div className="grow">
        <div className="grid grid-cols-2 gap-2">
          <div className="semi-bold text-black">
            カード名
          </div>
          <div className=" text-black">
            {name}
          </div>
          <div className="semi-bold text-black">
            グレード
          </div>
          <div className=" text-black">
            {grade}
          </div>
          <div className="semi-bold text-black">
            レアリティ
          </div>
          <div className=" text-black">
            {rarity}
          </div>
          <div className="text-black">
            {probability}
          </div>
        </div>
      </div>

      <Button onClick={onEdit} variant="text" className="flex items-end gap-2 grow-0">
        編集
        <ArrowLongRightIcon strokeWidth={2} className="w-4 h-4" />
      </Button>
      <Button onClick={onDelete} variant="text" className="flex items-end gap-2 grow-0">
        削除
        <ArchiveBoxIcon strokeWidth={2} className="w-4 h-4" />
      </Button>
    </CardContent>
  </Card>
}