import React, {useEffect} from 'react';


export default function NumberSpinner({
  min,
  max,
  step,
  value,
  style,
  callback,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  style: {};
  callback: (value: number) => void;
}) {
  const [currentValue, setCurrentValue] = React.useState(value);
  const [currentMin, setCurrentMin] = React.useState(min);
  const [currentMax, setCurrentMax] = React.useState(max);
  const [currentStep, setCurrentStep] = React.useState(step);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setCurrentMin(min);
  }, [min]);

  useEffect(() => {
    setCurrentMax(max);
  }, [max]);

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  const increment = () => {
    if (currentValue + currentStep > currentMax) {
      setCurrentValue(currentMax);
      callback(currentMax);
    } else {
      setCurrentValue(currentValue + currentStep);
      callback(currentValue + currentStep);
    }
  };

  const decrement = () => {
    if (currentValue - currentStep < currentMin) {
      setCurrentValue(currentMin);
      callback(currentMin);
    } else {
      setCurrentValue(currentValue - currentStep);
      callback(currentValue - currentStep);
    }
  };

  return (
    <div className="input-number">
      <button
        type="button"
        onClick={decrement}
        // style={{
        //   color: 'rgb(104, 36, 139)',
        // }}
      >
        &minus;
      </button>
      <span style={{ top: '5px' }}>
        {currentValue}
      </span>
      <button
        type="button"
        // style={{
        //   color: 'rgb(104, 36, 139)',
        // }}
        onClick={increment}
      >
        &#43;
      </button>
    </div>
  );
}

