import './InformationFeed.css';

export interface InformationRecord {
  pg_title: string;
  pg_content: string;
  createdon: string;
}

interface InformationFeedProps {
  items: InformationRecord[];
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

const InformationFeed = ({ items }: InformationFeedProps) => {
  if (items.length === 0) {
    return <p className="feed-empty">No information available.</p>;
  }

  return (
    <ul className="information-feed">
      {items.map((item, idx) => (
        <li key={idx} className="feed-item">
          <h2 className="feed-item-title">{item.pg_title}</h2>
          <time className="feed-item-date">{formatDate(item.createdon)}</time>
          <div
            className="feed-item-content"
            dangerouslySetInnerHTML={{ __html: item.pg_content }}
          />
        </li>
      ))}
    </ul>
  );
};

export default InformationFeed;