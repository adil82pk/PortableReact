import React from "react";
import axios from "axios";
import DataGrid, {
  Column,
  Selection,
  Scrolling,
} from "devextreme-react/data-grid";
import { SelectBox } from "devextreme-react/select-box";
import DropDownBox from "devextreme-react/drop-down-box";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      searchText: "",
      preference: [],
      token: "",
      username: "portable",
      password: "test",
      allMode: "allPages",
      checkBoxesMode: "onClick",
    };

    this.onCheckBoxesModeChanged = this.onCheckBoxesModeChanged.bind(this);
    this.onAllModeChanged = this.onAllModeChanged.bind(this);
  }

  componentDidMount = () => {
    //  this.populateNews();
  };

  populateNews = () => {
    const searchBody = {
      search: this.state.searchText,
      newsPreferences: this.state.preference,
    };

    axios
      .post("https://localhost:44387/site/get-site-news", searchBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.state.token,
        },
      })
      .then((data) => {
        this.setState({
          data: data.data,
        });
      });
  };

  selectPreference = (e) => {
    if (e.selectedRowsData && e.selectedRowsData.length > 0) {
      this.setState(
        { preference: e.selectedRowsData.map((item) => item.name) },
        this.populateNews
      );
    }
  };

  changeSearch = (e) => {
    this.setState({ searchText: e.target.value }, this.populateNews);
  };

  usernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  passwordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  getToken = (e) => {
    axios
      .post(
        "https://localhost:44387/api/account/login",
        { username: this.state.username, password: this.state.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((data) => {
        this.setState(
          {
            token: data.data["token"],
          },
          this.populateNews
        );
      });
  };

  render() {
    const { allMode, checkBoxesMode } = this.state;

    const { data } = this.state;
    const dataGridRenderer = () => {
      return (
        <DataGrid
          dataSource={[
            { value: "1", name: "GuardianService" },
            { value: "2", name: "TimesService" },
          ]}
          hoverStateEnabled
          columns={["name"]}
          showColumnLines={false}
          onSelectionChanged={this.selectPreference}
          showRowLines={false}
          showBorders={false}
        >
          <Selection mode="multiple" />
          <Scrolling mode="standard" />
        </DataGrid>
      );
    };

    return (
      <>
        <div>
          <input
            type="text"
            value={this.state.username}
            onChange={this.usernameChange}
          />
          <input
            type="text"
            value={this.state.password}
            onChange={this.passwordChange}
          />
          <button name="GenerateToken" onClick={this.getToken}>
            Generate Token
          </button>
        </div>
        <input
          type="text"
          value={this.state.search}
          onChange={this.changeSearch}
        />
        <DropDownBox
          value={[]}
          valueExpr="value"
          deferRendering={false}
          displayExpr="Sites"
          placeholder="Select a value..."
          showClearButton={true}
          dataSource={[
            { value: "1", name: "GaurdianService" },
            { value: "2", name: "TimesService" },
          ]}
          contentRender={dataGridRenderer}
        />
        <DataGrid dataSource={data} showBorders={true}>
          <Selection
            mode="multiple"
            selectAllMode={allMode}
            showCheckBoxesMode={checkBoxesMode}
            onChange
          />
          <Column dataField="id" caption="Id"></Column>
          <Column
            dataField="webPublicationDate"
            caption="Publication Date"
          ></Column>
          <Column dataField="webTitle" caption="Web Title"></Column>
          <Column dataField="webUrl" caption="Web Url"></Column>
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Select All Mode </span>
            <SelectBox
              id="select-all-mode"
              dataSource={["allPages", "page"]}
              value={allMode}
              disabled={checkBoxesMode === "none"}
              onValueChanged={this.onAllModeChanged}
            />
          </div>
          <div className="option checkboxes-mode">
            <span>Show Checkboxes Mode </span>
            <SelectBox
              id="show-checkboxes-mode"
              dataSource={["none", "onClick", "onLongTap", "always"]}
              value={checkBoxesMode}
              onValueChanged={this.onCheckBoxesModeChanged}
            />
          </div>
        </div>
      </>
    );
  }
  onCheckBoxesModeChanged({ value }) {
    debugger;
    this.setState({ checkBoxesMode: value });
    console.log("onCheckBoxesModeChanged", value);
  }

  onAllModeChanged({ value }) {
    debugger;
    this.setState({ allMode: value });
    console.log("onAllModeChanged", value);
  }
}
export default App;
