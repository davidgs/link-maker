import React, { useState, useEffect, useRef } from 'react';

type KnobProps = {
  size: number;
  min: number;
  max: number;
  numTicks: number;
  degrees: number;
  value: number;
  color: boolean;
  onChange: (newValue: number) => void | null;
};
const convertRange = (
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number,
    oldValue: number
  ) => {
    return ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
  };

export default function Knob({
  size,
  min,
  max,
  numTicks,
  degrees,
  value,
  color,
  onChange,
} : {
  size: number;
  min: number;
  max: number;
  numTicks: number;
  degrees: number;
  value: number;
  color: boolean;
  onChange: (newValue: number) => void | null;
}) {
  const [mySize, setMySize] = useState(size);
  const [myMin, setMyMin] = useState(min);
  const [myMax, setMyMax] = useState(max);
  const [myNumTicks, setMyNumTicks] = useState(numTicks);
  const [myDegrees, setMyDegrees] = useState(degrees);
  const [myValue, setMyValue] = useState(value);
  const [myColor, setMyColor] = useState(color);
  const [currentDegrees, setCurrentDegrees] = useState(0);
  const [myStartAngle, setMyStartAngle] = useState(0);
  const [myEndAngle, setMyEndAngle] = useState(0);
  const [myMargin, setMyMargin] = useState(0);
  const [myFullAngle, setMyFullAngle] = useState(0);
  const [myCurrentDegrees, setMyCurrentDegrees] = useState(0);

  // const fullAngle = degrees;
  // const startAngle = (360 - degrees) / 2;
  // const endAngle = startAngle + degrees;
  // const margin = size * 0.15;
  useEffect(() => {
    setMyFullAngle(myDegrees);
  }, [myDegrees]);

  useEffect(() => {
    setMyStartAngle((360 - myDegrees) / 2);
  }, [myDegrees]);

  useEffect(() => {
    setMyEndAngle(myStartAngle + myDegrees);
  }, [myStartAngle, myDegrees]);

  useEffect(() => {
    setMyMargin(mySize * 0.15);
  }, [mySize]);

  useEffect(() => {
    setCurrentDegrees(convertRange(myMin, myMax, myStartAngle, myEndAngle, myValue))
  }, [myValue, myMin, myMax, myStartAngle, myEndAngle]);

  // const [myDegrees, setMyDegrees] = useState(currentDeg);
  const knobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMySize(size);
  }, [size]);

  useEffect(() => {
    setMyMin(min);
  }, [min]);

  useEffect(() => {
    setMyMax(max);
  }, [max]);

  useEffect(() => {
    setMyNumTicks(numTicks);
  }, [numTicks]);

  useEffect(() => {
    setMyDegrees(degrees);
  }, [degrees]);

  useEffect(() => {
    setMyValue(value);
  }, [value]);

  useEffect(() => {
    setMyColor(color);
  }, [color]);


  // useEffect(() => {
  //   setMyDegrees(Math.floor(convertRange(myMin, myMax, myStartAngle, myEndAngle, myValue)));
  // }, [myValue, myMin, myMax, myStartAngle, myEndAngle]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const knob = e.currentTarget.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };
    const moveHandler = (e: MouseEvent) => {
      const newDeg = getDeg(e.clientX, e.clientY, pts);
      if (newDeg === myStartAngle) setMyDegrees(newDeg - 1);
      let newValue = Math.floor(
        convertRange(myStartAngle, myEndAngle, myMin, myMax, newDeg)
      );
      setMyDegrees(newDeg);
      onChange(newValue);
    };
    knobRef.current?.addEventListener('mousemove', moveHandler);
    knobRef.current?.addEventListener('mouseup', () => {
    knobRef.current?.removeEventListener('mousemove', moveHandler);
    });
  };

  const getDeg = (cX: number, cY: number, pts: { x: number; y: number }) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg += 270;
    }
    let finalDeg = Math.min(Math.max(myStartAngle, deg), myEndAngle);
    return finalDeg;
  };


  const renderTicks = () => {
    let ticks = [];
    const incr = myFullAngle / myNumTicks;
    const tSize = myMargin + mySize / 2;
    for (let deg = myStartAngle; deg <= myEndAngle; deg += incr) {
      const tick = {
        deg: deg,
        tickStyle: {
          height: tSize + 10,
          left: tSize - 1,
          top: tSize + 2,
          transform: 'rotate(' + deg + 'deg)',
          transformOrigin: 'top',
        },
      };
      ticks.push(tick);
    }
    return ticks;
  };

  const dcpy = (o) => {
    return JSON.parse(JSON.stringify(o));
  };

    const kStyle = {
      width: size,
      height: size,
    };
    const iStyle = dcpy(kStyle);
    const oStyle = dcpy(kStyle);
    oStyle.margin = myMargin;
    if (myColor) {
      oStyle.backgroundImage =
        'radial-gradient(100% 70%,hsl(210, ' +
        currentDegrees +
        '%, ' +
        currentDegrees / 5 +
        '%),hsl(' +
        Math.random() * 100 +
        ',20%,' +
        currentDegrees / 36 +
        '%))';
    }
    iStyle.transform = 'rotate(' + myDegrees + 'deg)';

    return (
      <div className="knob" style={kStyle}>
        <div className="ticks">
          {myNumTicks
            ? renderTicks().map((tick, i) => (
                <div
                  key={i}
                  className={
                    'tick' + (tick.deg <= currentDegrees ? ' active' : '')
                  }
                  style={tick.tickStyle}
                />
              ))
            : null}
        </div>
        <div ref={knobRef} className="knob outer" style={oStyle} onMouseDown={startDrag}>
          <div className="knob inner" style={iStyle}>
            <div className="grip" />
          </div>
        </div>
      </div>
    );
}
const defaultKnobProps = {
  size: 150,
  min: 10,
  max: 30,
  numTicks: 0,
  degrees: 270,
  value: 0,
  color: false,
  onChange: (newValue: number) => {
  },
};

// class App extends React.Component {
//   state = { value: 0 };

//   handleChange = (newValue) => {
//     this.setState({
//       value: newValue,
//     });
//   };
//   render() {
//     return (
//       <div className="App">
//         <Knob
//           size={30}
//           numTicks={50}
//           degrees={280}
//           min={1}
//           max={50}
//           value={30}
//           color={true}
//           onChange={this.handleChange}
//         />
//     );
//   }
// }
