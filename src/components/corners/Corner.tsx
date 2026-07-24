interface CornerProps {
  index: number;
  position: {
    x: number;
    y: number;
  };
}

const Corner = ({ position }: CornerProps) => {
  return (
    <div style={{ left: position.x, top: position.y }} className="point valid-move"></div>
  );
};

export default Corner;
