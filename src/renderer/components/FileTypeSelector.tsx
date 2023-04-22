import { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiletypeSvg, FiletypeJpg, FiletypePng } from 'react-bootstrap-icons';

interface Props {
  onSelectionChange: (selectedFileType: string) => void;
  fileType?: string;
}

const FileTypeSelector: React.FC<Props> = ({ onSelectionChange, fileType }) => {
  const [selectedFileType, setSelectedFileType] = useState(fileType);

  const handleSelectionChange = (event: React.MouseEvent<SVGSVGElement>) => {
    const fileType = event.currentTarget.getAttribute('data-value') as string;
    setSelectedFileType(fileType);
    onSelectionChange(fileType);
  };

  return (
    <div style={{ paddingTop: '10px' }}>
      <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        rootClose
        overlay={
          <Tooltip id="qrcode-tooltip">Generate QR Code as an svg.</Tooltip>
        }
      >
        <FiletypeSvg
          onClick={handleSelectionChange}
          data-value="svg"
          size={40}
          className={
            selectedFileType === 'svg'
              ? 'custom-radio selected'
              : 'custom-radio'
          }
          style={{
            cursor: 'pointer',
            marginRight: 10,
          }}
        />
      </OverlayTrigger>
      <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        rootClose
        overlay={
          <Tooltip id="qrcode-tooltip">Generate QR Code as a jpg image.</Tooltip>
        }
      >
      <FiletypeJpg
        onClick={handleSelectionChange}
        data-value="jpg"
        size={40}
        className={
          selectedFileType === 'jpg' ? 'custom-radio selected' : 'custom-radio'
        }
        style={{
          cursor: 'pointer',
          marginRight: 10,
        }}
      />
      </OverlayTrigger>
      <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        rootClose
        overlay={
          <Tooltip id="qrcode-tooltip">Generate QR Code as a png image.</Tooltip>
        }
      >
      <FiletypePng
        onClick={handleSelectionChange}
        data-value="png"
        size={40}
        className={
          selectedFileType === 'png' ? 'custom-radio selected' : 'custom-radio'
        }
        style={{
          cursor: 'pointer',
        }}
      />
      </OverlayTrigger>
    </div>
  );
};

export default FileTypeSelector;
