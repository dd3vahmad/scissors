import ILink from "../entites/Link";
import LinkCard from "./LinkCard";

interface IProps {
  links: ILink[];
}
const LinkList = ({ links }: IProps) => {
  return (
    <div>
      {links.map((link: ILink) => {
        return <LinkCard link={link} />;
      })}
    </div>
  );
};

export default LinkList;
