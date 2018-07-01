import QtQuick 2.3
import QtQuick.Controls 1.2

ApplicationWindow {
    visible: true
    width: 640
    height: 480
    title: qsTr("Hello World")

    menuBar: MenuBar {
        Menu {
            title: qsTr("File")
            MenuItem {
                text: qsTr("&Open")
                onTriggered: console.log("Open action triggered");
            }
            MenuItem {
                text: qsTr("Exit")
                onTriggered: Qt.quit();
            }
        }
    }

    ListModel {
        id: listModel

        ListElement {
            abc: 1
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 2
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 3
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 4
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 5
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 6
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 7
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 8
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 9
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 10
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 11
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 12
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 13
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 14
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 15
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 16
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 17
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 18
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 19
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 20
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 21
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 22
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 23
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 24
            name: "Banana"
            cost: 1.95
        }
        ListElement {
            abc: 25
            name: "Apple"
            cost: 2.45
        }
        ListElement {
            abc: 26
            name: "Orange"
            cost: 3.25
        }
        ListElement {
            abc: 27
            name: "Banana"
            cost: 1.95
        }
    }

    ListView {
        id: listView
        width: 200
        height: 200
        model: listModel
        clip: true

        delegate: Item {
            width: 180; height: 40
            Column {
                Text { text: '<b>Id:</b> ' + abc }
                Text { text: '<b>Name:</b> ' + name }
                Text { text: '<b>Cost:</b> ' + cost }
            }
        }


        property bool isFirtTimeGetContentHeight: true
        property bool isEditingOriginalModel: false
        property var originalModel: ListModel {

        }

        property double originalContentHeight: 0


        /*
        onDragEnded: {
            var velocityThreshold = 1200
            var movementRate = listView.contentY / listView.height
            if (Math.abs(verticalVelocity) < velocityThreshold && Math.abs(movementRate) < .16) {
                return
            }
            //wrapList()
            if ((listView.model === null) || (listView.originalModel === null)) {
                return;
            }

            if ((listView.model.count === 0) || (listView.originalModel.count === 0)) {
                return;
            }

            if (listView.isFirtTimeGetContentHeight) {
                listView.isFirtTimeGetContentHeight = false;
                listView.originalContentHeight = contentHeight;
            }


            //Scroll over top
            if (atYBeginning) {
                for (var i = listView.originalModel.count -1; i >= 0 ; i--) {
                    listView.model.insert(0, listView.originalModel.get(i));
                }

                //If more than two page, we will remove the last page
                if ((listView.model.count / listView.originalModel.count) > 2) {
                    for (var i = 0; i < listView.originalModel.count; i++) {
                        listView.model.remove(listView.model.count - 1);
                    }
                }

                console.log("content height:" + contentHeight);
                console.log("content height1:" + originalContentHeight);

                //If content height of list view changed, will update content y
                if (listView.contentHeight > listView.originalContentHeight) {
                    listView.contentY = listView.originalContentHeight;
                }


            }

            else if (atYEnd) {
                listView.isEditingOriginalModel = true;
                for (var i = 0; i < listView.originalModel.count; i++) {
                    listView.model.append(listView.originalModel.get(i));
                }


                //If more than two page, we will remove the last page
                if ((listView.model.count / listView.originalModel.count) > 2) {
                    for (var i = 0; i < listView.originalModel.count; i++) {
                        listView.model.remove(0);
                    }
                }

                if (listView.contentHeight > listView.originalContentHeight) {
                    listView.contentY = listView.originalContentHeight - listView.height;
                }

            }


        }
        */

        onDragEnded: {
            var velocityThreshold = 1200
            var movementRate = listView.contentY / listView.height
            if (Math.abs(verticalVelocity) < velocityThreshold && Math.abs(movementRate) < .16) {
                return
            }
            //wrapList()
            if ((listView.model === null) || (listView.originalModel === null)) {
                return;
            }

            if ((listView.model.count === 0) || (listView.originalModel.count === 0)) {
                return;
            }

            if (listView.isFirtTimeGetContentHeight) {
                listView.isFirtTimeGetContentHeight = false;
                listView.originalContentHeight = contentHeight;
            }


            //Scroll over top
            if (atYBeginning) {
                if ((listView.model.count / listView.originalModel.count) < 2) {
                    for (var i = listView.originalModel.count -1; i >= 0 ; i--) {
                        listView.model.insert(0, listView.originalModel.get(i));
                    }
                }

                //If content height of list view changed, will update content y
                if (listView.contentHeight > listView.originalContentHeight) {
                    listView.contentY = listView.originalContentHeight;
                }


            }

            else if (atYEnd) {
                if ((listView.model.count / listView.originalModel.count) < 2) {
                    for (var i = 0; i < listView.originalModel.count; i++) {
                        listView.model.append(listView.originalModel.get(i));
                    }
                }

                if (listView.contentHeight > listView.originalContentHeight) {
                    listView.contentY = listView.originalContentHeight - listView.height;
                }

            }


        }

        function updaetOriginalModel() {
            console.log("Call this funtions");
            listView.isFirtTimeGetContentHeight = true;
            listView.originalModel.clear();
            for (var i = 0; i < listModel.count; i++) {
                listView.originalModel.append(listModel.get(i));
            }

        }
    }

    Component.onCompleted: {
        listView.updaetOriginalModel()
    }
}
