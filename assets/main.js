//----------------------------------------------------------------
// Table sort with pagination by prathibha - Epic Lanka (Pvt) Ltd
//----------------------------------------------------------------

//globel variables
var icon; //sort icon
var add_count = false; //count column
var pagination_table = false; //pagination


Object.prototype._table = function (properties) {

    var id = this.id;
    var i, rows, count, th, span, ss;

    rows = this.getElementsByTagName("TR");
    count = rows[0].getElementsByTagName("TH").length;
    th = rows[0].getElementsByTagName("TH");
    span = document.createElement("span");

    //sort all columns
    if (properties.sort_all) {
        for (i = 0; i < count; i++) {
            th[i].addEventListener("click", function (index) {
                var inx = index.toElement.cellIndex;
                if (typeof inx === "undefined") {
                    inx = index.path[1].cellIndex;
                }
                sortTable(inx, id);

                addCountCol(add_count, id);
                replaceCountCol(add_count, id);
                if (pagination_table) {
                    sliceTable(0, properties.table_rowCount, document.getElementById(id));
                }
                span.setAttribute("class", icon);
                th[inx].appendChild(span);
            });
            th[i].style.cursor = "pointer";
            th[i].className += " epic-ui-noselect";

        }

    }
    //sort specific columns
    else if (properties.sort_all == false && properties.sort_columns.length > 0) {
        properties.sort_columns.forEach(function (element) {

            var indexi = element

            th[element - 1].addEventListener("click", function (index) {
                var inx = index.toElement.cellIndex;
                if (typeof inx === "undefined") {
                    inx = index.path[1].cellIndex;
                }
                sortTable(inx, id);
                addCountCol(add_count, id);
                replaceCountCol(add_count, id);
                if (pagination_table) {
                    sliceTable(0, properties.table_rowCount, document.getElementById(id));
                }
                span.setAttribute("class", icon);
                th[inx].appendChild(span);
            });

            th[element - 1].style.cursor = "pointer";
            th[element - 1].className += " epic-ui-noselect";

        })
    }

    //add caption
    if (typeof properties.table_title === "string") {
        var position = "";
        var caption = this.createCaption();
        caption.innerHTML = properties.table_title;
    } else {
        if (properties.table_title.length > 0) {
            var position = "";
            var caption = this.createCaption();
            caption.innerHTML = properties.table_title[0];

            if (properties.table_title.length == 2) {
                if (properties.table_title[1].toLowerCase() == "l") {
                    position = "left";
                } else if (properties.table_title[1].toLowerCase() == "r") {
                    position = "right";
                } else {
                    position = "center";
                }
                caption.style.textAlign = position;
            }
        }
    }

    //table ui
    if (properties.table_ui_theme) {
        this.className += " epic-ui-table";
    }
    //add count
    if (properties.table_count) {
        add_count = true;
        replaceCountCol(add_count, id);
    }
    //pagination
    if (properties.table_pagination) {
        pagination_table = true;
        pagination(properties.table_rowCount, id, properties.table_index);
    }


}

function sortTable(n, id) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(id);
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (isNaN(x.innerHTML.toLowerCase())) {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        icon = "epic-ui-svg-sortup";
                        break;
                    }
                } else {
                    if (Number(x.innerHTML.toLowerCase()) > Number(y.innerHTML.toLowerCase())) {
                        shouldSwitch = true;
                        icon = "epic-ui-svg-sortup";
                        break;
                    }
                }
            } else if (dir == "desc") {
                if (isNaN(x.innerHTML.toLowerCase())) {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        icon = "epic-ui-svg-sortdown";
                        break;
                    }
                } else {
                    if (Number(x.innerHTML.toLowerCase()) < Number(y.innerHTML.toLowerCase())) {
                        shouldSwitch = true;
                        icon = "epic-ui-svg-sortdown";
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;


        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }

    }

}
//function createCSSLink() {
//    var x = document.createElement("LINK");
//    x.setAttribute("rel", "stylesheet");
//    x.setAttribute("type", "text/css");
//    x.setAttribute("href", "dd/main.css");
//    document.head.appendChild(x);
//}

function replaceCountCol(add_count, tableId) {

    if (add_count) {
        var table = document.getElementById(tableId);
        var ths = document.getElementById(tableId).tHead.children[0].children[0];
        var tr = document.getElementById(tableId).tHead.children[0];
        var th = document.createElement('th');
        th.setAttribute("style", "width:1px;");
        th.innerHTML = "";
        tr.insertBefore(th, ths);

        var row = table.getElementsByTagName("tr");
        for (i = 1; i < row.length; i++) {
            var x = row[i].insertCell(0);
            x.style.textAlign = "center";
            if (i % 2 == 0) {
                x.style.backgroundColor = "#404d6c";
            } else {
                x.style.backgroundColor = "#55617e";
            }

            x.style.color = "#00bcd4";
            x.style.fontWeight = "bold";
            //            x.style.borderTop = "1px solid gray";
            //        x.style.position = "fixed";

            x.innerHTML = i;
        }
    }

}

function addCountCol(add_count, tableID) {
    if (add_count) {
        var table = document.getElementById(tableID);
        var row = table.getElementsByTagName("tr");

        for (i = 0; i < row.length; i++) {
            var x = row[i].deleteCell(0);
        }
    }
}

function pagination(numPerPage, tableID, tableIndex) {
    var currentPage = 0;
    var numPerPage = numPerPage;
    var $table = document.getElementById(tableID);
    var rows = $table.getElementsByTagName("TR");
    var numRows = (rows.length - 1); //except first table head row
    var numPages = Math.ceil(numRows / numPerPage);

    sliceTable(currentPage, numPerPage, $table); //remove and add 

    var id_index = "epic-ui-pager-" + tableIndex;
    console.log(id_index);
    var el = document.createElement("div");
    el.setAttribute("class", "epic-ui-pager");
    el.setAttribute("id", id_index);

    console.log(tableID);
    $table.parentNode.insertBefore(el, $table.nextSibling);

    var $pager = document.getElementById(id_index); //pagination element

    //add pagen numbers with click event
    for (var page = 0; page < numPages; page++) {
        var span = document.createElement("span");
        span.setAttribute("class", "epic-ui-pagenumber hide");
        span.textContent = page + 1;
        span.addEventListener("click", function (event) {
            currentPage = (this.innerText - 1);
            sliceTable(currentPage, numPerPage, $table);


            console.log(this.previousSibling);


            console.log(this.nextSibling);

            var count = this.parentElement.children.length;
            if (count > 0) {
                for (i = 0; i < count; i++) {
                    this.parentElement.children[i].className = "epic-ui-pagenumber clickable hide";
                }
            }
            this.className = " epic-ui-pagenumber unhide epic-ui-active";
            if(this.previousSibling!=null){
                this.previousSibling.className = "epic-ui-pagenumber unhide";
            }
            if(this.nextSibling!=null){
                this.nextSibling.className = "epic-ui-pagenumber unhide";
            }
            
            
        });
        console.log(id_index);
        span.className += " clickable";
        $pager.appendChild(span);
    }
    $pager.firstChild.className = "epic-ui-pagenumber unhide epic-ui-active"; // add active class on first page
    $pager.children[1].className = "epic-ui-pagenumber unhide";
}

//slice function
function sliceTable(currentPage, numPerPage, $table) {
    var i, j, k;
    var rows = $table.getElementsByTagName("TR");
    var toarray = [];

    for (i = 0; i < rows.length - 1; i++) {
        toarray[i] = rows[i + 1];
    }
    //slice 
    var sliceArray = toarray.slice(currentPage * numPerPage, (currentPage + 1) * numPerPage);

    for (j = 1; j < rows.length; j++) {
        rows[j].style.display = "none";
    }
    for (k = 0; k < sliceArray.length; k++) {
        sliceArray[k].style.display = "";
    }
}
