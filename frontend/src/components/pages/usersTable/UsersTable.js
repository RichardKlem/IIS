import React, {Component} from 'react';
import Users from "./Users";

class UsersTable extends Component {

    filterTableColumnFunction = () => {
        let rowWasHidden = false;
        const keys = ["0", "1", "2", "3", "4", "5", "6"];
        for (let key of keys) {
            // Declare variables
            let input, filter, table, tr, td, i, txtValue;
            input = document.getElementById(key);
            if (input === null) {
                return
            }
            filter = input.value.toUpperCase();
            table = document.getElementById("myTable");
            tr = table.getElementsByTagName("tr");

            // Loop through all table rows, and hide those who don't match the search query
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[key];
                if (typeof (td) !== 'undefined') {
                    td = td.getElementsByTagName("input")[0];
                    if (td) {
                        txtValue = td.value;
                        if (txtValue.toUpperCase().indexOf(filter) > -1 && (tr[i].style.display !== "none" || rowWasHidden === false)) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                            rowWasHidden = true;
                        }
                    }
                }
            }
        }
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">Actions</h2>
                        <h4 className="card-description"> User table:</h4>
                        <div className="table-responsive">
                            <table className="table table-hover" id="myTable">
                                <thead>
                                <tr>
                                    <th>ID<input style={{minWidth: '100px', maxWidth: 'auto/5'}}
                                                 className="text-center form-control form-control-sm" type="text" id="0"
                                                 onKeyUp={this.filterTableColumnFunction}/></th>
                                    <th>Full Name<input style={{width: 'auto'}}
                                                        className="text-center form-control form-control-sm" type="text"
                                                        id="1" onKeyUp={this.filterTableColumnFunction}/></th>
                                    <th>Mobile<input style={{width: 'auto'}}
                                                     className="text-center form-control form-control-sm" type="tel"
                                                     pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" id="2"
                                                     onKeyUp={this.filterTableColumnFunction}/></th>
                                    <th>Email<input style={{width: 'auto'}}
                                                    className="text-center form-control form-control-sm" type="email"
                                                    id="3" onKeyUp={this.filterTableColumnFunction}/></th>
                                    <th>Birth Date<input style={{width: 'auto'}}
                                                         className="text-center form-control form-control-sm"
                                                         type="date" id="4" onKeyUp={this.filterTableColumnFunction}/>
                                    </th>
                                    <th>Address<input style={{width: 'auto'}}
                                                      className="text-center form-control form-control-sm" type="text"
                                                      id="5" onKeyUp={this.filterTableColumnFunction}/></th>
                                    <th>Role<input style={{minWidth: '40px', maxWidth: 'auto/5'}}
                                                   className="text-center form-control form-control-sm" type="text"
                                                   id="6" maxLength="1" onKeyUp={this.filterTableColumnFunction}/></th>
                                </tr>
                                </thead>
                                <tbody>
                                <Users users={this.props.users}/>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UsersTable;
