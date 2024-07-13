import ILink from "../entites/Link";

interface IProps {
  links: ILink[];
}
const LinkList = ({ links }: IProps) => {
  return <div>Links List</div>;
};

export default LinkList;
