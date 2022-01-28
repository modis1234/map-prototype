/**
 * @function bind
 * @description 최초 맵을 그리기 위해 호출 되는 메소드 함수로
 *              data는 useState이고 callbackd은 setState 콜백 함수
 * @param {Object} data useState 초기값
 *  @property {number} objectId 객체 아이디
 *  @property {number} block_length 블록간 거리
 *  @property {number} total_length 노선 총 굴진 거리
 *  @property {string} forward_index 정방향(시점) 노선 인덱스
 *  @property {number} forward_length 정방향(시점) 계획 굴진 거리
 *  @property {number} forward_dig 정방향(시점) 진행 굴진거리
 *  @property {Object} forward_device 정방향(시점) 설치 장비 정보 객체
 *      @property {number} cctv cctv 설치 위치
 *      @property {number} scanner scanner 설치 위치
 *  @property {string} revers_index 역방향(종점) 노선 인덱스
 *  @property {number} revers_length 역방향(종점) 계획 굴진 거리
 *  @property {number} revers_dig 역방향(종점) 진행 굴진거리
 *  @property {Object} revers_device 역방향(종점) 설치 장비 정보 객체
 *      @property {number} cctv cctv 설치 위치
 *      @property {number} scanner scanner 설치 위치
 *  @property {number} block_amount 맵 블록 갯수 (default:10)
 *  @property {boolean} is_entry 횡갱 지점 유무
 *  @property {boolean} is_shaft 사갱 지점 유무
 *  @property {number} shaft_entry_point 사갱 진입 지점
 *  @property {string} shaft_type_entry 사갱 오픈 여부 'open'/'closed'
 *  @property {Object} shaft_info 사갱 정보 - is_shaft가 true일 경우만 존재
 *      @property {number} total_length 사갱 총 굴진거리
 *      @property {number} start_point 사갱 시작 지점
 *      @property {number} end_point 사갱 끝 지점
 *      @property {string} forward_index 정방향(사갱시점) 노선 인덱스
 *      @property {number} forward_length 정방향(사갱시점) 굴진거리
 *      @property {number} forward_dig 정방향(사갱시점) 진행 굴진거리
 *      @property {Object} forward_device 정방향(사갱시점) 설치 장비 정보 객체
 *          @property {number} cctv cctv 설치 위치
 *          @property {number} scanner scanner 설치 위치
 *      @property {string} revers_index 역방향(사갱종점) 노선 인덱스
 *      @property {number} revers_length 역방향(사갱종점) 굴진거리
 *      @property {number} revers_dig 역방향(사갱종점) 진행 굴진거리
 *      @property {Object} revers_device 역방향(사갱종점) 설치 장비 정보 객체
 *          @property {number} cctv cctv 설치 위치
 *          @property {number} scanner scanner 설치 위치
 * @param {function} callback setState 콜백 함수
 */

/**
 * @function rendering 맵을 그려주는 메소드
 * @description bind 함수에 실행 되서 setState 된 객체의 데이터를 items로 인자로 받아 JSX Container를 return
 * @param {number} initTopPoint div 영역에서 첫 블럭의 css top position 값
 * @param {number} initLeftPoint div 영역에서 첫 블럭의 css left position 값
 * @param {object} items useState의 객체 값
 * @param {boolean} isExpand (default=false) 확대 맵 여부
 * @returns {JSX}
 */

/**
 * @function bleDataBinding BLE 데이터 바인딩
 * @description ble 데이터가 data 인자로 들어오면 맵을 리렌더링
 * @param {Object[]} data
 * @param {Object[]} dig
 * @param {function} callback
 */

/**
 * @function deviceBindingHandler
 * @description 장비 위치 데이터 바인딩 핸들러
 * @param {INT} index 현재 인덱스
 * @param {FLOAT} totalLength   총 굴진 거리
 * @param {FLOAT} forwardLength 정방향 거리
 * @param {FLOAT} deviceLength 디바이스 설치거리
 * @param {FLOAT} blockLength    1블록 당 거리
 * @param {FLOAT} reversDig   역방향 굴진 거리
 * @param {FLOAT} shaftEntryPoint   사갱 진입 지점
 * @param {BOOLEAN} revers   시점/종점 여부
 * @param {BOOLEAN} shaft   사갱/횡갱 존재 여부
 * @returns {BOOLEAN} true/false 장비 표시 여부
 */
