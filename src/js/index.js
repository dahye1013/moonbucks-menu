/**
 * 요구 사항 - STEP1 -----------------------------------------------------------
 * (메뉴추가)
 * [X] 메뉴의 이름을 입력 받고, 확인 버튼을 누르면 메뉴가 추가된다.
 * [X] 메뉴의 이름을 입력 받고, 엔터키 입력으로 메뉴가 추가된다.
 * [X] 추가되는 메뉴의 아래 마크업은 `<ul id="menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
 * [X] 총 메뉴 갯수를 count하여 상단에 보여준다.
 * [X] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
 * [X] 사용자 입력값이 빈 값이라면 추가되지 않는다.
 *
 * (메뉴 수정)
 * [X] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창이 뜬다.
 * [X] 모달창에서 신규 메뉴명을 입력 받고, 확인 버튼 클릭시 메뉴가 수정된다.
 *
 * (메뉴 삭제)
 * [X] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
 * [X] 확인 버튼을 클릭하면 메뉴가 삭제된다.
 *
 * ----------------------------------------------------------------------------
 */
/**
 * 요구 사항 - STEP2 -----------------------------------------------------------
 * (local storage) - ref: https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage
 * [] localStorage에 데이터를 저장한다.
 *    1. 메뉴를 추가할떄
 *    2. 메뉴를 수정할때
 *    3. 메뉴를 삭제할때
 * [] localStorage에 저장된 데이터를 읽어온다.
 *
 * (카테고리 별 메뉴판 관리)
 * [X] 에스프레소 메뉴판 관리
 * [X] 프라푸치노 메뉴판 관리
 * [X] 블렌디드 메뉴판 관리
 * [X] 티바나 메뉴판 관리
 * [X] 디저트 메뉴판 관리
 *
 * (페이지 접근시 최초 데이터 Read & Rendering)
 * [X] 페이지 최초 로딩시 localStorage의 에스프레소 메뉴를 읽어온다.
 * [X] 에스프레소 메뉴를 페이지에 그려준다.
 *
 * [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
 * [] 품절 버튼을 추가한다.
 * [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
 * [] 클릭이벤트에서 가장 가까운 li 태그의 class 속성 값에 sold-out을 추가한다.
 * ------------------------------------------------------------------------------
 */

/**[인사이트]
 * 1. 이벤트 위임방법
 * 2. function의 변수화
 * 3. 새롭게 알게 된 메소드 closest, insertAdjacentHTML
 * 4. 상태 => 상태는 꼭 관리해야하는 것들만을 대상으로해야한다.
 *    ex) 개수 등은 메뉴의 length로 get해 올 수 있는데, 상태로서 관리한다면 복잡성만 증가
 * 5. TODO : this scope와 생성자 관계
 * 6. 
 */

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  //상태 - 변하는 데이터  (메뉴명)
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
      render();
    }

    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${
          item.name
        }</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const createMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuCount = () => {
    $(".menu-count").innerText = `총 ${
      this.menu[this.currentCategory].length
    }; 개`;
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    const updateMenuName = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const newMenuName = prompt("메뉴명을 수정해주세요.", $menuName.innerText);
      this.menu[this.currentCategory][menuId].name = newMenuName;
      store.setLocalStorage(this.menu);
      render();
    };

    const removeMenuName = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      if (confirm("정말 삭제하시겠습니까?")) {
        const $menuName = e.target.closest("li");
        render();
      }
    };

    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        console.log(categoryName);
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });

    //[form 태그가 자동으로 전송되는 것을 방지]

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    //[클릭으로 메뉴 입력받기]
    $("#menu-submit-button").addEventListener("click", createMenuName);

    //[엔터로 메뉴 입력받기]
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      createMenuName();
    });
  };
}

const app = new App();
app.init();
