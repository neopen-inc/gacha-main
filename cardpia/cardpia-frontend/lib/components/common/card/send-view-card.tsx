
interface SendViewCardProps {
  onClick?: () => void;
  selected?: boolean;
  card: any;
}
export function SendViewCard({ selected, card }: SendViewCardProps ) {
  return <div>

    <div className={`${selected ? 'bg-selectedGray' :  'bg-white'} rounded shadow-lg p-4 text-black flex`}>
      <div>
        <img src={card.thumbnail} className="-rotate-12" />
      </div>
      <div>
        <div className="text-black font-semibold">
        {
          card.name
        }
        </div>
        <div className="font-semibold text-[#495058]">
        {
          card.rarity
        }
        </div>
        <div className="font-extralight text-[#495058]">
        
        {
          card.size
        }
        </div>
        <div className="font-semibold text-black">
        {
          card.point
        }
        </div>
      </div>
    </div>
  </div>
}


//#459BA0