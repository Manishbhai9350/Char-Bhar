interface CornerProps {
  index: number;
  position: {
    x: number;
    y: number;
  };
}

const Corner = ({ position, index }: CornerProps) => {
  return (
    <div style={{ left: position.x, top: position.y }} className="point valid-move">{index}</div>
  );
};

export default Corner;
