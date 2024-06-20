import './display-card.css';

interface DisplayCardProps {
  onClick?: () => void;
  card: any;
}
export function DisplayCard({ card }: DisplayCardProps ) {
  return <div className="w-36">
    <div className="rounded-md px-3 py-1 relative" style={{
      background: 'url(/card-bg.png) repeat'
    }}>
      <img src="/card-mark.png" className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/4 w-7" />
      <img src={card.thumbnail} />
    </div>
    <dl className="text-center">
      <dt className="text-xs  text-[#383838]">
      {card.name}
      </dt>
      <dd className="text-xs font-semibold">
      
      </dd>
    </dl>
    </div>
}


//#459BA0