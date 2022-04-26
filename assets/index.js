window.onload = function () {
    let meatItems = {
        "food": [{
            id: "F01",
            name: "義大利麵",
            price: 180
        }, {
            id: "F02",
            name: "夏威夷披薩",
            price: 220
        }, {
            id: "F03",
            name: "頂級羊排",
            price: 330
        },
        {
            id: "F04",
            name: "頂級羊排",
            price: 330
        },
        {
            id: "F05",
            name: "義大利麵",
            price: 180
        }, {
            id: "F06",
            name: "夏威夷披薩",
            price: 220
        }, {
            id: "F07",
            name: "頂級羊排",
            price: 330
        },
        {
            id: "F08",
            name: "義大利麵",
            price: 180
        }, {
            id: "F09",
            name: "夏威夷披薩",
            price: 220
        }],
        "drink": [
            {
                id: "D01",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "D02",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "D03",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "D04",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "D05",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "D06",
                name: "頂級羊排",
                price: 330
            }
        ],
        "sweets": [
            {
                id: "S01",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "S02",
                name: "頂級羊排",
                price: 330
            },
            {
                id: "S03",
                name: "頂級羊排",
                price: 330
            }
        ]
    };

    let buyCart = [];

    let menuType = '';

    refreshPayList();

    let menuItems = document.querySelectorAll(".menu-item");
    let checkPage = document.querySelector(".detail-wrap");
    let seletedData = {};

    const INITVAL = 0;
    const detailCount = document.getElementById("display-number");
    detailCount.innerText = INITVAL;

    if (menuItems && menuItems.length > 0) {
        menuItems.forEach(function (item) {
            item.addEventListener('click', function () {
                const menuContainer = document.getElementById("menu-container");
                menuContainer.innerHTML = '';
                menuType = item.getAttribute("data-type");
                let menuDatas = meatItems[menuType];
                if (menuDatas && menuDatas.length > 0) {
                    let menuHtml = '';
                    menuDatas.forEach(function (menu) {
                        menuHtml += `
                            <div id="${menu.id}" class="content-item">
                                <img src="./assets/image/${menuType}/${menu.id}.jpg" alt="">
                                <div class="comment">${menu.name} (${menu.price}元) </div>
                            </div>
                        `;
                    });
                    menuContainer.innerHTML = menuHtml;

                    let itemBtn = document.querySelectorAll(".content-item");
                    if (itemBtn.length > 0) {
                        itemBtn.forEach(function (item) {
                            item.addEventListener('click', function (event) {
                                event.preventDefault();
                                item.classList.add("active");
                                seletedData = menuDatas.find(function (meat) {
                                    return meat.id == item.id;
                                });
                                setDetailInfo({ name: seletedData.name, count: INITVAL });
                            });
                        });
                    }
                }
            });
        });
        menuItems[0].click();
    }

    let cancelBtn = document.querySelector("#cancel-count");
    cancelBtn.addEventListener('click', function (event) {
        event.preventDefault();
        displayDetailPage(false);
        let itemBtn = document.querySelectorAll(".content-item");
        itemBtn.forEach(function (item) {
            item.classList.remove("active");
        });
    });

    let checkBtn = document.querySelector("#check-count");
    checkBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const meatCount = document.getElementById("display-number").innerText;
        const parseVal = parseInt(meatCount, 10);
        if (!isNaN(parseVal) && parseVal > 0) {
            let meatData = {
                id: seletedData.id,
                count: meatCount,
                type: menuType
            }

            if (buyCart.length > 0) {
                let meatExist = buyCart.some(function (someItem) {
                    return someItem.id === meatData.id;
                });

                if (meatExist) {
                    let existMeat = buyCart.find((item) => {
                        return item.id === meatData.id;
                    });
                    existMeat.count = meatCount;
                }
                else {
                    buyCart.push(meatData);
                }
            }
            else {
                buyCart.push(meatData);
            }

            refreshPayList();

            displayDetailPage(false);
            let itemBtn = document.querySelectorAll(".content-item");
            itemBtn.forEach(function (item) {
                item.classList.remove("active");
            });

        } else {
            alert('請輸入正確的數值')
        }
    });

    let numBtn = document.querySelectorAll('.a-num');
    numBtn.forEach((item) => {
        item.addEventListener('click', function () {
            let inputNum = item.innerText;
            if (detailCount.innerText == INITVAL) {
                detailCount.innerText = inputNum;
            } else {
                detailCount.innerText += inputNum;
            }
        });
    });

    let countResetBtn = document.getElementById("count-reset");
    countResetBtn.addEventListener('click', function () {
        detailCount.innerText = 0;
    });


    const checkedBillBtn = document.getElementById("check-bill");
    checkedBillBtn.addEventListener('click', function () {
        if (buyCart.length > 0) {
            if (confirm("確認點餐完畢?")) {
                const posOrderWrap = document.getElementById("pos-list-order-wrap");
                posOrderWrap.style.display = "block";

                let html = '';
                let totalMoney = 0;
                buyCart.forEach((buy) => {
                    let buyRelated = getDataFromMenu(buy.type, buy.id);
                    let buyTotal = buy.count * buyRelated.price;
                    totalMoney += buyTotal;
                    html += `
                        <tr>
                            <td>${buyRelated.name}</td>
                            <td>${buy.count}</td>
                            <td>${buyTotal}</td>
                        </tr>
                    `;
                });

                document.getElementById("order-items-container").innerHTML = html;
                document.getElementById("display-pos-total").innerText = totalMoney;
                const now = new Date();
                let timeForat = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                document.getElementById("order-time-content").innerText = timeForat;
                clearInterval(interDec);
            }
        } else {
            alert("請至少點一項餐點");

        }
    });

    const cancelBillBtn = document.getElementById("cancel-bill");
    cancelBillBtn.addEventListener('click', function () {
        if(confirm("確定要清空?")){
            buyCart = [];
            refreshPayList();
        }
        
    });

    let interDec;
    const startBtn = document.getElementById("start-pos");
    startBtn.addEventListener('click',function(){
        displayStarPage(false);
        let nowSec = 120;
        const timeWrap = document.getElementById("retain-time");
        timeWrap.innerText = nowSec;
        interDec = setInterval(() => {
            nowSec -= 1;
            timeWrap.innerText = nowSec;
            if (nowSec <= 0) {
                clearInterval(interDec);
                displayStarPage(true);
                buyCart = [];
                refreshPayList();
            }
        }, 1000);
    });

    
    
    function displayStarPage(display){
        const startPage = document.getElementById("start-page-wrap");
        let attr = 'none';
        if(display){
            attr = 'block';
        }
        startPage.style.display = attr;
    }

    function setDetailInfo(data) {
        const detailHeader = document.getElementById("detail-name");
        detailHeader.innerHTML = data.name;

        detailCount.innerText = data.count;
        displayDetailPage(true);
    }

    function displayDetailPage(display) {
        if (checkPage) {
            let attr = 'none';
            if (display) {
                attr = 'block';
            }
            checkPage.style.display = attr;
        }
    }

    function refreshPayList() {
        document.getElementById("pay-container").innerHTML = '';
        if (buyCart && buyCart.length > 0) {
            let html = ``;
            buyCart.forEach((item, index) => {
                let matchMeat = meatItems[item.type].find((meat) => {
                    return meat.id == item.id;
                });

                html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${matchMeat.name}</td>
                    <td>${item.count}</td>
                    <td>${matchMeat.price * item.count}</td>
                    <td>
                        <a href="#" class="update-count" data-id="${item.id}">修</a> /
                        <a href="#" class="delete-meat" data-id="${item.id}">刪</a>
                    </td>
                </tr>`
            });

            document.getElementById("pay-container").innerHTML = html;
            let meatDelete = document.querySelectorAll(".delete-meat");
            if (meatDelete.length > 0) {
                meatDelete.forEach((item) => {
                    item.addEventListener('click', () => {
                        if (confirm("確定要刪除")) {
                            buyCart = buyCart.filter((deleteItem) => {
                                return deleteItem.id !== item.getAttribute("data-id");
                            });
                            refreshPayList();
                        }

                    });
                });
            }

            let meatUpdate = document.querySelectorAll(".update-count");
            if (meatUpdate.length > 0) {
                meatUpdate.forEach((item) => {
                    item.addEventListener('click', () => {
                        let updateItem = buyCart.find((payItem) => {
                            return payItem.id == item.getAttribute("data-id");
                        });

                        if (updateItem) {
                            seletedData = meatItems[updateItem.type].find(function (meat) {
                                return meat.id == updateItem.id;
                            });
                        }
                        setDetailInfo({ name: seletedData.name, count: updateItem.count });
                    });
                });
            }
        }
    }

    function getDataFromMenu(type, id) {
        return meatItems[type].find(item => {
            return item.id === id;
        })
    }
}