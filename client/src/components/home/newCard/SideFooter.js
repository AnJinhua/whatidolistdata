import { SidebarFooterContainer } from "./styles";

function SideFooter() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <SidebarFooterContainer>
      <center>
        © {year}-{year + 1} the global network, llc. / what i do{" "}
      </center>
    </SidebarFooterContainer>
  );
}

export default SideFooter;
