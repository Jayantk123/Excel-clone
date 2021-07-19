let defaultprop = {
        "text": "",
        "font weight": "",
        "font-style": "",
        "text-decoration": "",
        "text-align": "left",
        "background-color": "#ffffff",
        "color": "#000000",
        "font-family": "Noto Sans",
        "font-size": "14px"
    }
    //used for storing update data


let cellData = {
    "Sheet1": {

    }
}
let selectedSheet = "Sheet1";
let totalSheet = 1;
let lastaddsheet = 1;

$(document).ready(function() {

    let cellContainer = $('input-area');

    for (let i = 1; i <= 100; i++) {


        let ans = "";
        let n = i;

        while (n > 0) {
            let rem = n % 26;

            if (rem == 0) {
                ans = "Z" + ans;
                n = Math.floor(n / 26) - 1;
            } else {

                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }




        let column = $(`<div class="column-name colid-${i} " id="colcod-${ans} ">${ans}</div>`);
        $(".column").append(column);


        let row = $(`<div class="row-name rowid-${i}">${i}</div>`)
        $(".row").append(row);
    }




    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row "></div?>`) //create a row
        for (let j = 1; j <= 100; j++) {
            let colcode = $(`.colid-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell " contenteditable="true" id="row-${i}-col-${j}" data="code-${colcode}"></div>`)
            row.append(column);

        }

        $(".input-area").append(row);


    }


    $(".align-icon").click(function() {


        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        // for left format/right/center

    });

    $(".on-icon").click(function() {
        $(this).toggleClass("selected"); //on h to off vice versa
        // $(this).addClass("selected");
        // for bold italic underline on and off

    });

    $(".input-cell").click(function(e) {
        if (e.ctrlKey) {
            let [rowId, colId] = getRowCol(this);

            if (rowId > 1) {
                let topCellSelected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
                if (topCellSelected) {
                    // console.log(rowId - 1, colId);
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }
            if (rowId < 100) {
                let bottomCellSelected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
                if (bottomCellSelected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }
            }
            if (colId > 1) {
                let leftCellSelected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
                if (leftCellSelected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }
            }
            if (colId < 100) {
                let rightCellSelected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
                if (rightCellSelected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }
            }
        } else {
            $(".input-cell.selected").removeClass("selected");
        }
        $(this).addClass("selected");
        changeHeader(this);

    });
    //cell change krne pe header m property change like bold italic selected
    function changeHeader(ele) {
        let [rowId, colId] = getRowCol(ele);
        //check if properties present or not
        let cellInfo = defaultprop;

        if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
            cellInfo = cellData[selectedSheet][rowId][colId];
        }
        //cell info nikalne k baad usa lga do agr nhi lgi to

        cellInfo['font-weight'] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo['font-style'] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo['text-decoration'] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
        let aligment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $("icon-align-" + aligment).addClass("selected");
        $(".background-color-picker").val(cellInfo["background-color"]);
        $(".text-color-picker").val(cellInfo["color"]);
        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selctor").css("font-family", cellInfo["font-family"]);
        $(".font-size-selector").val(cellInfo["font-size"]);

    }


    //content editable

    $(".input-cell").dblclick(function() {
        $(".input-cell.selected").removeClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();

    });

    $(".input-cell").blur(function() {
        $(".input-cell.selected").attr("contenteditable", "false");
        //storing text
        updateCell("text", $(this).text());
    })



    //scroll left -> x axis
    // scroll up down ->y axis

    $(".input-area").scroll(function() {
        console.log(this.scrollLeft);
        $(".column").scrollLeft(this.scrollLeft);
        $(".row").scrollTop(this.scrollTop);
    });




});
// gives current row-col id
function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
}

function updateCell(property, value, defaultPossible) {
    $(".input-cell.selected").each(function() {
        $(this).css(property, value);

        let [rowId, colId] = getRowCol(this);
        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {
                cellData[selectedSheet][rowId][colId][property] = value;
            } else {
                cellData[selectedSheet][rowId][colId] = {...defaultprop };
                cellData[selectedSheet][rowId][colId][property] = value;

            }
        } else {
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = {...defaultprop };
            cellData[selectedSheet][rowId][colId][property] = value;
        }

        if (defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultPossible))) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
    });
    console.log(cellData);
}


$(".icon-bold").click(function() {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "", true); //phle s bold h to remove
    } else {
        updateCell("font-weight", "bold", false); //bold kr dya
    }
})

$(".icon-italic").click(function() {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "", true); //phle s bold h to remove
    } else {
        updateCell("font-style", "italic", false); //bold kr dya
    }
})


$(".icon-underline").click(function() {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "", true); //phle s bold h to remove
    } else {
        updateCell("text-decoration", "underline", false); //bold kr dya
    }
});
$(".icon-align-left").click(function() {
    if (!$(this).hasClass("selected ")) {
        updateCell("text-align", "left", true);
    }
})




$(".icon-align-center").click(function() {
    if (!$(this).hasClass("selected ")) {
        updateCell("text-align", "center", true);
    }
})

$(".icon-align-right").click(function() {
    if (!$(this).hasClass("selected ")) {
        updateCell("text-align", "right", true);
    }
});


$(".color-fill-icon").click(function() {
    $(".background-color-picker").click();
})

$(".color-text-icon").click(function() {
    $(".text-color-picker").click();
});

$(".background-color-picker").change(function() {
    updateCell("background-color", $(this).val());
})

$(".text-color-picker").change(function() {
    updateCell("color", $(this).val());
});


$(".font-family-selector").change(function() {
    updateCell("font-family", $(this).val());
    $("font-family-selctor").css("font-family", $(this).val());
})

$(".font-size-selector").change(function() {
    updateCell("font-size", $(this).val());
});

//for new sheet -->empty data in new sheet

function emptySheet() {
    let sheetInfo = cellData[selectedSheet];

    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
            $(`#row-${i}-col-${j}`).css("color", "#000000");
            $(`#row-${i}-col-${j}`).css("text-align", "left");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("font-style", "");
            $(`#row-${i}-col-${j}`).css("text-decoration", "");
            $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size", "14px");

        }
    }
}
//add data in sheet
function loadSheet() {
    let sheetInfo = cellData[selectedSheet];

    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            let cellInfo = cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);

        }
    }
}

//add sheet in ui
$(".icon-add").click(function() {
    emptySheet(); //empty sheet
    $(".sheet-tab.selected").removeClass("selected"); //remove current selected sheet
    let sheetName = "Sheet" + (lastaddsheet + 1);
    cellData[sheetName] = {};
    totalSheet += 1;
    lastaddsheet += 1;
    selectedSheet = sheetName;
    $(".sheet-tab-container").append(` <div class="sheet-tab selected">${sheetName}</div>`);

    addSheetEvents();
});

function addSheetEvents() {
    $(".sheet-tab.selected").click(function() {

        if (!$(this).hasClass("selected ")) {
            selectSheet(this);
        }
    });

    $(".sheet-tab.selected").contextmenu(function(e) {

        e.preventDefault();
        //default right click off
        // console.log("hello");
        // add custom modal 
        selectSheet(this);

        if ($("sheet-option-modal").length == 0) {

            $(".lower-bar").append(` <div class="sheet-option-modal">
        <div class="sheet-rename">Rename</div>
        <div class="sheet-delete">Delete</div> </div>`);





            // add rename box

            $(".sheet-rename").click(function() {
                $(".lower-bar").append(`<div class="sheet-rename-modal">
                <h4 class="modal-title">Rename Sheet To: </h4>
                <input type="text" class="new-sheet-name" placeholder="Sheet Name" />
                <div class="action-button">
            
                    <div class="submit-button">Submit</div>
                    <div class="cancel-button">Cancel</div>
            
                </div>
            
            </div>`);



                $(".cancel-button").click(function() {
                    $(".sheet-rename-modal").remove();
                });


                $(".submit-button").click(function() {
                    let newSheetname = $(".new-sheet-name").val();
                    // console.log(newSheetname);
                    $(".sheet-tab.selected").text(newSheetname);
                    let newCellData = {};
                    for (let key in cellData) {
                        if (key != selectedSheet) {
                            newCellData[key] = cellData[key];
                        } else {
                            newCellData[newSheetname] = cellData[key];
                        }
                    }
                    cellData = newCellData;
                    selectedSheet = newSheetname;


                    $(".sheet-rename-modal").remove();

                })
            });

            //delete sheet

            $(".sheet-delete").click(function() {
                $(".lower-bar").append(`<div class="sheet-rename-modal delete-sh">
                <h4 class="modal-title text-align:center">Are you want to sure delete these Sheet ?</h4>
                
                <div class="action-button">
            
                    <div class="submit-delete-button">Delete</div>
                    <div class="cancel-delete-button">Cancel</div>
            
                </div>
            
            </div>`);

                $(".cancel-delete-button").click(function() {
                    $(".sheet-rename-modal").remove();
                });



                $(".submit-delete-button").click(function() {
                    if (Object.keys(cellData).length > 1) {
                        let currSheetName = selectedSheet;
                        let currSheet = $(".sheet-tab.selected");

                        let currSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
                        if (currSheetIndex == 0) {
                            $(".sheet-tab.selected").next().click();
                        } else {
                            $(".sheet-tab.selected").prev().click();
                        }
                        delete cellData[currSheetName];
                        currSheet.remove();
                    } else {
                        alert("Sorry, there is only one sheet. So, it's not possible");
                    }

                    $(".sheet-rename-modal").remove();
                })

            });







        }
        $(".sheet-option-modal").css("left", e.pageX + "px");

    });

}



$(".container").click(function() {
    $(".sheet-option-modal").remove();
})




addSheetEvents();

function selectSheet(ele) {
    $(".sheet-tab.selectd").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    loadSheet();
}