import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import "./App.css";
import uid from "uid";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUploaded: false,
            selectedFile: null,
            tableData: [],
            delimiter: ",",
            lines: 2,
        };
    }
    onChangeHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        });
    };
    onClickHandler = () => {
        // let fileReader = new FileReader();
        // fileReader.onloadend = () => {
        //     console.log(fileReader.result);
        // };
        // fileReader.readAsText(this.state.selectedFile);

        const data = new FormData();
        data.append("file", this.state.selectedFile);
        const { delimiter, lines } = this.state;
        fetch(
            `http://localhost:4000/upload?delimiter=${delimiter}&lines=${lines}`,
            {
                method: "POST",
                body: data,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                this.setState({ tableData: result, fileUploaded: true });
                console.log("Success:", result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value, tableData: [] }, () => {
            const { delimiter, lines, fileUploaded } = this.state;
            if (!fileUploaded) return;
            if (!delimiter || !lines) return;
            fetch(
                `http://localhost:4000/filter?delimiter=${delimiter}&lines=${lines}`,
                {
                    method: "GET",
                }
            )
                .then((response) => response.json())
                .then((result) => {
                    this.setState({ tableData: result });
                    console.log("Success:", result);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        });
    };
    render() {
        return (
            <Card id="container">
                <div id="fileUpload">
                    <input
                        type="file"
                        name="file"
                        accept=".txt"
                        onChange={this.onChangeHandler}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={this.onClickHandler}
                    >
                        Upload File
                    </Button>
                </div>

                <div id="filters">
                    <TextField
                        type="text"
                        name="delimiter"
                        id="delimiter"
                        label="Delimiter"
                        placeholder="E.g |"
                        value={this.state.delimiter}
                        onChange={this.handleChange}
                    />
                    <TextField
                        type="number"
                        name="delimiter"
                        id="lines"
                        label="Lines"
                        placeholder="E.g 2"
                        value={this.state.lines}
                        onChange={this.handleChange}
                    />
                </div>
                <TableContainer component={Paper} id="table">
                    <Table aria-label="simple table">
                        <TableBody>
                            {this.state.tableData.map((ele) => (
                                <TableRow key={uid()}>
                                    {ele
                                        .split(this.state.delimiter || ",")
                                        .map((elm) => (
                                            <TableCell
                                                align="right"
                                                key={uid()}
                                            >
                                                {elm}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        );
    }
}

export default App;
