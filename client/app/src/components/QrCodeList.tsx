import IQrCode from "../entites/QrCode";

interface IProps {
  qrcodes: IQrCode[];
}

const QrCodeList = ({ qrcodes }: IProps) => {
  return <div>QrCode List</div>;
};

export default QrCodeList;
