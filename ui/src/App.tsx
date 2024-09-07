import devicePng from "./assets/device.png";
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from "@coreui/react";

function App() {
  return (
    <div>
      <header></header>
      <body>
        <CCard className="text-center" style={{ width: "18rem" }}>
          <CCardImage orientation="top" src={devicePng} width={"100rem"} />
          <CCardBody>
            <CCardTitle>Card title</CCardTitle>
            <CCardText>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </CCardText>
            <CButton color="primary" href="#">
              Go somewhere
            </CButton>
          </CCardBody>
        </CCard>
      </body>
    </div>
  );
}

export default App;
