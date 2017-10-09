//--------------------------------------------------------------------------
// Table sort with pagination by prathibha Sathyajith- Epic Lanka (Pvt) Ltd
//--------------------------------------------------------------------------


//globel variables
var icon; //sort icon


Object.prototype._table = function (properties) {

    //---------------- validation -------------------------------
    try {
        properties.table_index.value;
    } catch (e) {
        console.error(e);
        console.error("table_index field is mandatory. You must declare unique name or number.");
    }

    if (properties.table_title == null) {
        properties.table_title = [];
    }

    if (properties.table_rowCount == null) {
        properties.table_rowCount = [10, 15, 20];
    }
    //-----------------------------------------------------------

    var id = this.id;
    var i, rows, count, th, span, HiddenColumnList;
    var sort_columns = getSortableColumnList(this.getElementsByTagName("th"));

    rows = this.getElementsByTagName("TR");
    count = rows[0].getElementsByTagName("TH").length;
    th = rows[0].getElementsByTagName("TH");
    span = document.createElement("span");

    //reset column width
    if (properties.table_fitColumns) {
        this._tableWidth();
    }

    //sort all columns
    if (properties.sort_all) {
        for (i = 0; i < count; i++) {
            th[i].addEventListener("click", function (index) {
                var inx = index.toElement.cellIndex;
                if (typeof inx === "undefined") {
                    inx = index.path[1].cellIndex;
                }
                sortTable(inx, id);
                toFirstPage(properties.table_index);
                addCountCol(properties.table_count, id);
                replaceCountCol(properties.table_count, id, properties.table_ui_theme);
                if (properties.table_pagination) {
                    sliceTable(0, properties.table_rowCount[0], document.getElementById(id));
                }
                span.setAttribute("class", icon);
                th[inx].appendChild(span);
            });
            th[i].style.cursor = "pointer";
            th[i].className += " epic-ui-noselect";

        }

    }
    //sort specific columns
    else if (properties.sort_all == false && sort_columns.length > 0) {
        sort_columns.forEach(function (element) {

            var indexi = element

            th[element - 1].addEventListener("click", function (index) {
                var inx = index.toElement.cellIndex;
                if (typeof inx === "undefined") {
                    inx = index.path[1].cellIndex;
                }
                sortTable(inx, id);
                toFirstPage(properties.table_index);
                addCountCol(properties.table_count, id);
                replaceCountCol(properties.table_count, id, properties.table_ui_theme);
                if (properties.table_pagination) {
                    sliceTable(0, properties.table_rowCount[0], document.getElementById(id));
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
        replaceCountCol(properties.table_count, id, properties.table_ui_theme);
    }
    //pagination
    if (properties.table_pagination) {
        try {
            pagination(properties.table_rowCount[0], id, properties.table_index, properties.table_ui_theme, properties.table_rowCount);
        } catch (e) {
            console.error("Please add table_rowCount array property with elements(length=3) ");
        }
    }

    //hide data-hidden column list
    HiddenColumnList = getHiddenColumnList(this.getElementsByTagName("th"));
    hideColumn(this, HiddenColumnList);

    //bind row select event
    bindClickEvent(this);

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
        //unselect row
        for (var i = 0; i < rows.length; i++) {
            var children = rows[i].parentNode.children;
            for (var t = 0; t < children.length; t++) {
                children[t].className = "row-unSelected";
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

function replaceCountCol(add_count, tableId, theme) {
    var table, ths, tr, th;

    if (add_count) {
        table = document.getElementById(tableId);
        ths = document.getElementById(tableId).tHead.children[0].children[0];
        tr = document.getElementById(tableId).tHead.children[0];

        th = document.createElement('th');
        th.setAttribute("style", "width:1px;");
        th.innerHTML = "";
        tr.insertBefore(th, ths);

        var row = table.getElementsByTagName("tr");
        for (i = 1; i < row.length; i++) {
            var x = row[i].insertCell(0);
            if (theme) {
                x.style.textAlign = "center";
                if (i % 2 == 0) {
                    x.style.backgroundColor = "#404d6c";
                } else {
                    x.style.backgroundColor = "#55617e";
                }
                x.style.color = "#00bcd4";
                x.style.fontWeight = "bold";
                x.style.width = "1px";
                //            x.style.borderTop = "1px solid gray";
                //        x.style.position = "fixed";
            }

            x.innerHTML = i;
        }
    }

}

function addCountCol(add_count, tableID) {
    var table, row;
    if (add_count) {
        table = document.getElementById(tableID);
        row = table.getElementsByTagName("tr");
        for (i = 0; i < row.length; i++) {
            var x = row[i].deleteCell(0);
        }
    }
}

//slice function
function sliceTable(currentPage, numPerPage, $table) {
    var i, j, k, rows, toarray, sliceArray;

    rows = $table.getElementsByTagName("TR");
    toarray = [];

    for (i = 0; i < rows.length - 1; i++) {
        toarray[i] = rows[i + 1];
    }
    //slice 
    sliceArray = toarray.slice(currentPage * numPerPage, (currentPage + 1) * numPerPage);

    for (j = 1; j < rows.length; j++) {
        rows[j].style.display = "none";
    }
    for (k = 0; k < sliceArray.length; k++) {
        sliceArray[k].style.display = "";
    }
}

function getSortableColumnList(object) {
    var count = object.length;
    var sortColunms = [];
    for (var i = 0; i < count; i++) {
        if (object[i].getAttribute("data-sortable") == "true") {
            sortColunms.push(i + 1);
        }
    }
    return sortColunms;
}

function getHiddenColumnList(object) {
    var count = object.length;
    var sortColunms = [];
    for (var i = 0; i < count; i++) {
        if (object[i].getAttribute("data-hidden") == "true") {
            sortColunms.push(i);
            object[i].setAttribute("hidden", "true");
        }
    }
    return sortColunms;
}

function hideColumn(Object, HideArray) {
    var trList = Object.getElementsByTagName("tr");

    for (var i = 1; i < trList.length; i++) {
        HideArray.forEach(function (item, index) {
            trList[i].children[item].setAttribute("hidden", "true");
        });
    }
}

//row select event bind
function bindClickEvent(Object) {
    var node = [];
    var trList = Object.getElementsByTagName("tr");

    for (var i = 0; i < trList.length; i++) {
        trList[i].addEventListener('click', function (event) {
            node = this.parentNode.children;
            for (var t = 0; t < node.length; t++) {
                node[t].className = "row-unSelected";
            }
            this.className = "row-selected";
        });
    }
}

//------------------pagination-----------------------------------------------------

function pagination(numPerPage, tableID, tableIndex, theme, rows_per_page) {

    var currentPage, numPerPage, $table, rows, numRows, numPages, id_index, el, $pager;

    currentPage = 0;
    numPerPage = numPerPage;
    $table = document.getElementById(tableID);
    rows = $table.getElementsByTagName("TR");
    numRows = (rows.length - 1); //except first table head row
    numPages = Math.ceil(numRows / numPerPage);

    sliceTable(currentPage, numPerPage, $table); //remove and add 

    id_index = "epic-ui-pager-" + tableIndex;
    el = document.createElement("div");

    //insert theme colors
    if (theme) {
        el.setAttribute("class", "epic-ui-pager epic-ui-noselect");
    }
    el.setAttribute("id", id_index);
    $table.parentNode.insertBefore(el, $table.nextSibling);

    $pager = document.getElementById(id_index); //pagination element

    //add record count
    recordCount(numRows, $pager);

    //add '<' arrow to front
    addArrowLeft($pager);

    //add pagen numbers with click event
    for (var page = 0; page < numPages; page++) {
        var span = document.createElement("span");
        span.setAttribute("class", "epic-ui-pagenumber epic-ui-hide");
        span.textContent = page + 1;
        span.addEventListener("click", function (event) {
            currentPage = (this.innerText - 1);
            sliceTable(currentPage, numPerPage, $table);

            var count = this.parentElement.children.length;
            if (count > 0) {
                for (i = 2; i < count - 2; i++) {
                    this.parentElement.children[i].className = "epic-ui-pagenumber epic-ui-hide";
                }
            }
            this.className = " epic-ui-pagenumber epic-ui-unhide epic-ui-active";
            if (this.previousSibling != null && this.previousSibling.className != "epic-ui-pageup") {
                this.previousSibling.className = "epic-ui-pagenumber epic-ui-unhide";
            }
            if (this.nextSibling != null && this.nextSibling.className != "epic-ui-pagedown") {
                this.nextSibling.className = "epic-ui-pagenumber epic-ui-unhide";
            }

        });
        //        span.className += " clickable";
        $pager.appendChild(span);
    }
    // add active class on first page
    try {
        $pager.firstChild.nextSibling.nextSibling.className = "epic-ui-pagenumber unhide epic-ui-active";
    } catch (err) {
        console.error("you should fill table_rowCount arry of length 3 ");
    }

    //check if have 3rd element?
    if (Boolean($pager.children[3])) {
        $pager.children[3].className = "epic-ui-pagenumber unhide";
    }

    //add '>' arrow to back
    addArrowRight($pager);
    numOfRows(tableID, tableIndex, theme, $pager, rows_per_page);
}

//left arrow
function addArrowLeft($pager) {
    var span = document.createElement("span");
    span.setAttribute("class", "epic-ui-pageup");
    span.textContent = "<<";
    span.addEventListener("click", function (event) {
        var span = this.nextSibling;
        var click = new Event('click');
        span.dispatchEvent(click);
    });
    $pager.appendChild(span);
}

//right arrow
function addArrowRight($pager) {
    var span = document.createElement("span");
    span.setAttribute("class", "epic-ui-pagedown");
    span.textContent = ">>";
    span.addEventListener("click", function (event) {
        var span = this.previousSibling;
        var click = new Event('click');
        span.dispatchEvent(click);
    });
    $pager.appendChild(span);
}

//dispaly number of rows for a page
function numOfRows(id, table_index, table_ui_theme, $pager, rows_per_page) {
    var id_index = "epic-ui-pager-" + table_index;
    var span = document.createElement("span");
    var dd = rows_per_page;

    span.setAttribute("class", "epic-ui-numOfRows");
    span.textContent = "Rows: ";
    for (var i = 1; i < 4; i++) {
        var spanc = document.createElement("span");
        spanc.textContent = dd[i - 1];
        spanc.setAttribute("data-index", dd[i - 1]); //set first must
        spanc.setAttribute("class", "epic-ui-showRowClick");

        spanc.addEventListener("click", function (event) {
            var element = document.getElementById(id_index);
            element.parentNode.removeChild(element);
            var count = event.path[0].attributes[0].nodeValue;

            pagination(count, id, table_index, table_ui_theme, rows_per_page);

        });
        span.appendChild(spanc);
    }
    $pager.appendChild(span);
}

//add record count to pagination
function recordCount(numRows, $pager) {
    var span = document.createElement("span");
    span.setAttribute("class", "epic-ui-recordCount");
    span.textContent = "Records : " + numRows;
    $pager.appendChild(span);
}

function toFirstPage(tableIndex) {
    var id_index, $pager, span, click

    id_index = "epic-ui-pager-" + tableIndex;
    $pager = document.getElementById(id_index);
    span = $pager.firstChild.nextSibling.nextSibling;
    click = new Event('click');
    span.dispatchEvent(click);

}

//---------------------------------------------------------------------------------

//get max length of columns
Object.prototype._tableWidth = function () {
    var width, rows, count, colWidth, th, i, $pager;

    width = this.parentElement.offsetWidth
    rows = this.getElementsByTagName("TR");
    count = rows[0].getElementsByTagName("TH").length;
    th = rows[0].getElementsByTagName("TH");
    colWidth = Math.ceil(width / count);

    for (i = 0; i < count; i++) {
        th[i].style.cursor = "pointer";
        th[i].style.width = colWidth + "px";
        th[i].className += " epic-ui-noselect";
    }
}
