/* eslint-disable */
/**
 * @function rendering
 * @function bleDataBinding
 * @function deviceBindingHandler
 */
const mapUtils = {
    bind(data, callback) {
        const _this = this;
        console.log('->', data);
        const {
            objectId, // objectId
            block_length: blockLength = 0, // 블럭 거리당 할다 거리,
            total_length: totalLength, // 총 굴진 거리
            forward_index: forwardIndex, // 정방향 인덱스
            forward_length, // 정방향 굴진거리
            forward_dig, // 정방향 진행 굴진거리
            forward_device: forwardDevice, // 정방향 장비
            revers_index: reverseIndex, // 역방향 인덱스
            revers_length, // 역방향 진행 인덱스
            revers_dig, // 역방향 진행 굴진거리
            revers_device: reversDevice, // 역방향 장비
            block_amount: blockAmount, // 블럭 갯수
            // shaft = false, // 사갱 유무
            is_shaft: isShaft = false, // 사갱 유무
            is_entry: isEntry,
            // shaft_entry_point = 0,
            // shaft_type_entry: shaftTypeEntry = null,
            // shaft_info: shaftInfo = null, // 사갱 정보
        } = data;

        // const blockLength = totalLength / blockAmount; // 1개 블록 당 거리
        const forwardLength = forward_length + blockLength;
        const forwardDig = forward_dig !== 0 ? forward_dig + blockLength : 0;

        const reversLength = revers_length - blockLength;
        const reversDig = revers_dig;
        // const reversDig = 300;

        // const shaftEntryPoint = isEntry ? shaft_entry_point + blockLength : 0;

        // const shaftStartPoint =
        //     shaftInfo !== null ? shaftInfo.start_point + blockLength : 0;
        // const shaftEndPoint =
        //     shaftInfo !== null ? shaftInfo.end_point + blockLength : 0;

        let mapArr = [];
        for (let i = 1; i <= blockAmount; i++) {
            const divisionBlockLeng = blockLength * i; // 위치

            const _revers = divisionBlockLeng <= forwardLength ? false : true;

            const obj = {
                id: i,
                value: i,
                objectId,
                local_index:
                    divisionBlockLeng <= forwardLength
                        ? forwardIndex
                        : reverseIndex,
                total_length: totalLength,
                open:
                    divisionBlockLeng < forwardLength
                        ? forwardDig >= divisionBlockLeng ||
                          forwardDig === forwardLength
                            ? true // 굴착
                            : forwardDig > 0 && i === blockAmount
                            ? true
                            : false // 미굴착
                        : //정방향 이라면
                        reversDig >= totalLength - blockLength * (i - 1) ||
                          reversDig === reversLength // 1블럭당 306m로 구간이 짧아 1블럭을 기본으로 추가 해준다.
                        ? true // 굴착
                        : reversDig > 0 && blockAmount === i
                        ? true
                        : false, // 미굴착 //역방향 이라면,
                // 사갱 없음
                worker: false,
                worker_count: 0,
                vehicle: false,
                vehicle_count: 0,
                // scanner: false,
                cctv: _this.deviceBindingHandler({
                    index: i,
                    totalLength,
                    forwardLength: !_revers ? forwardLength : reversLength,
                    deviceLength: !_revers
                        ? forwardDevice.cctv
                        : reversDevice.cctv,
                    blockLength,
                    reversDig,
                    revers: _revers,
                }),
                scanner: _this.deviceBindingHandler({
                    index: i,
                    totalLength,
                    forwardLength: !_revers ? forwardLength : reversLength,
                    deviceLength: !_revers
                        ? forwardDevice.scanner
                        : reversDevice.scanner,
                    blockLength,
                    reversDig,
                    revers: _revers,
                }),
                revers: _revers,
                dig_length: _revers ? revers_dig : forward_dig,
                block_length: blockLength,
                division_length: divisionBlockLeng,
                show: {
                    worker: true,
                    vehicle: true,
                    cctv: true,
                    scanner: true,
                },
            };
            mapArr = [...mapArr, obj];
        }
        callback(mapArr);
    },
    rendering(initTopPoint, initLeftPoint, items, isExpand = false) {
        const entranceStyle = {
            position: 'absolute',
            top: `${initTopPoint + 32}px`,
            left: `${initLeftPoint - 15}px`,
            zIndex: '100',
        };
        const exitStyle = {
            position: 'absolute',
            top: ``,
            left: '',
            zIndex: '100',
        };

        return (
            <>
                <img
                    src="/images/map/entrance.svg"
                    alt="입구"
                    className="entrance-image"
                    id={`entrance-${initTopPoint}`}
                    style={entranceStyle}
                />
                {items.map((item, index, array) => {
                    // console.log('->', item);
                    const {
                        objectId,
                        shaft,
                        revers,
                        value,
                        division_length,
                        shaft_type_entry,
                        entry,
                        open,
                    } = item;
                    const topCalc = !isExpand ? 33.4 : 61;
                    const leftCalc = !isExpand ? 58 : 107;
                    const _blockStyled = {
                        top: `${initTopPoint - topCalc * index}px`,
                        left: `${initLeftPoint + leftCalc * index}px`,
                        zIndex: `${99 - objectId - index}`,
                    };
                    const _imgStyled = {
                        width: !isExpand ? '135px' : '241px',
                        height: !isExpand ? '124px' : '218px',
                    };

                    const workerStyled = {
                        backgroundImage: shaft
                            ? revers
                                ? 'url("/images/map/workerFor.png")'
                                : 'url("/images/map/workerRev.png")'
                            : revers
                            ? 'url("/images/map/workerRev.png")'
                            : 'url("/images/map/workerFor.png")',
                        backgroundRepeat: 'no-repeat',
                    };

                    const vehicleStyled = {
                        backgroundImage: shaft
                            ? revers
                                ? 'url("/images/map/vehFor.png")'
                                : 'url("/images/map/vehRev.png")'
                            : revers
                            ? 'url("/images/map/vehRev.png")'
                            : 'url("/images/map/vehFor.png")',
                        backgroundRepeat: 'no-repeat',
                    };

                    if (array.length - 1 === index) {
                        // debugger;
                        exitStyle.top = `${
                            initTopPoint - topCalc * index - 10.4
                        }px`;
                        exitStyle.left = `${
                            initLeftPoint + leftCalc * index + 58
                        }px`;
                    }

                    return (
                        <div
                            className="block"
                            id={`block-${value}`}
                            key={`tableRowKey${index}`}
                            style={_blockStyled}
                            value={division_length}
                        >
                            <img
                                src={
                                    !isExpand
                                        ? entry
                                            ? `/images/map/${
                                                  shaft_type_entry === 'open'
                                                      ? 'shaft_open_type'
                                                      : 'shaft_close_type'
                                              }.png`
                                            : open
                                            ? `/images/map/${
                                                  open ? 'open' : 'close'
                                              }.svg`
                                            : `/images/map/close.svg`
                                        : entry
                                        ? `/images/map/expand/${
                                              shaft_type_entry === 'open'
                                                  ? 'expand_shaft_open'
                                                  : 'expand_shaft_close'
                                          }.svg`
                                        : open
                                        ? `/images/map/expand/${
                                              open
                                                  ? 'expand_open'
                                                  : 'expand_close'
                                          }.png`
                                        : `/images/map/expand/expand_close.png`
                                }
                                alt="close"
                                className={
                                    !isExpand
                                        ? ''
                                        : entry
                                        ? shaft_type_entry === 'open'
                                            ? 'expand_shaft_open'
                                            : 'expand_shaft_close'
                                        : open
                                        ? open
                                            ? 'expand_open'
                                            : 'expand_close'
                                        : `expand_close`
                                }
                                style={_imgStyled}
                            />
                            {item.show.worker && open && item.worker && (
                                <div
                                    className="worker-icon"
                                    style={workerStyled}
                                >
                                    <div className="worker-count-box">
                                        {item.worker_count}
                                    </div>
                                </div>
                            )}
                            {item.show.vehicle && open && item.vehicle && (
                                <div
                                    className="vehicle-icon"
                                    style={vehicleStyled}
                                >
                                    <div className="vehicle-count-box">
                                        {item.vehicle_count}
                                    </div>
                                </div>
                            )}
                            {item.show.scanner && open && item.scanner && (
                                <div className="scanner-icon">
                                    <div className="scanner-img"></div>
                                    <div className="scanner-device-box"></div>
                                </div>
                            )}
                            {item.show.cctv && open && item.cctv && (
                                <div className="cctv-icon">
                                    <div className="cctv-img"></div>
                                    <div className="cctv-device-box"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <img
                    src="/images/map/entrance.svg"
                    alt="입구"
                    className="entrance-image"
                    id={`exit-${initTopPoint}`}
                    style={exitStyle}
                />
            </>
        );
    },
    bleDataBinding(data, dig, callback) {
        const updateDig = dig.map((item, index, array) => {
            let tempItem = {
                ...item,
                worker: false,
                worker_count: 0,
                vehicle: false,
                vehicle_count: 0,
            };

            const { revers, shaft, entry } = item;
            data.map((bleItem) => {
                if (item.local_index === bleItem.local_index) {
                    const { scn_pos_x, scn_kind } = bleItem;
                    const {
                        block_length: blockLength,
                        division_length: divisionLength,
                        shaft_entry_point: shaftEntryPoint,
                        total_length: totalLength,
                    } = tempItem;
                    if (!shaft) {
                        if (!revers) {
                            // 시점
                            const positionLeng =
                                scn_kind === 4
                                    ? item.dig_length - blockLength
                                    : scn_pos_x;
                            if (
                                positionLeng >=
                                    totalLength - blockLength * (index - 1) &&
                                positionLeng + blockLength * (index + 1)
                            ) {
                                if (bleItem.wk_id) {
                                    tempItem = {
                                        ...tempItem,
                                        worker: true,
                                        worker_count: tempItem.worker_count + 1,
                                    };
                                }
                                if (bleItem.vh_id) {
                                    tempItem = {
                                        ...tempItem,
                                        vehicle: true,
                                        vehicle_count:
                                            tempItem.vehicle_count + 1,
                                    };
                                }
                            }
                        } else {
                            // 종점
                            // eslint-disable-next-line no-lonely-if
                            const positionLeng =
                                scn_kind === 4
                                    ? item.dig_length - blockLength
                                    : scn_pos_x;
                            if (
                                positionLeng > totalLength - divisionLength &&
                                array[index - 1] &&
                                positionLeng <
                                    totalLength -
                                        array[index - 1].division_length
                            ) {
                                if (bleItem.wk_id) {
                                    tempItem = {
                                        ...tempItem,
                                        worker: true,
                                        worker_count: tempItem.worker_count + 1,
                                    };
                                }
                                if (bleItem.vh_id) {
                                    tempItem = {
                                        ...tempItem,
                                        vehicle: true,
                                        vehicle_count:
                                            tempItem.vehicle_count + 1,
                                    };
                                }
                            }
                        }
                    } else {
                        const {
                            block_length: blockLength,
                            division_length: divisionLength,
                            shaft_entry_point: shaftEntryPoint,
                        } = tempItem;
                        // 사갱
                        if (!revers) {
                            // 사갱 -시점
                            if (
                                shaftEntryPoint - scn_pos_x > divisionLength &&
                                shaftEntryPoint - scn_pos_x <
                                    (array[index + 1] &&
                                        array[index + 1].division_length)
                            ) {
                                if (bleItem.wk_id) {
                                    tempItem = {
                                        ...tempItem,
                                        worker: true,
                                        worker_count: tempItem.worker_count + 1,
                                    };
                                }
                                if (bleItem.vh_id) {
                                    tempItem = {
                                        ...tempItem,
                                        vehicle: true,
                                        vehicle_count:
                                            tempItem.vehicle_count + 1,
                                    };
                                }
                            }
                        } else {
                            // 사갱 -종점
                            // eslint-disable-next-line no-lonely-if
                            if (
                                shaftEntryPoint + scn_pos_x > divisionLength &&
                                shaftEntryPoint + scn_pos_x <
                                    (array[index + 1] &&
                                        array[index + 1].division_length)
                            ) {
                                if (bleItem.wk_id) {
                                    tempItem = {
                                        ...tempItem,
                                        worker: true,
                                        worker_count: tempItem.worker_count + 1,
                                    };
                                }
                                if (bleItem.vh_id) {
                                    tempItem = {
                                        ...tempItem,
                                        vehicle: true,
                                        vehicle_count:
                                            tempItem.vehicle_count + 1,
                                    };
                                }
                            }
                        }
                    }
                }
                return bleItem;
            });
            return tempItem;
        });

        callback(updateDig);
    },
    deviceBindingHandler({
        index, // 현재 인덱스
        totalLength, // 총 굴진 거리
        forwardLength, // 정방향 굴진거리
        deviceLength, // 디바이스 설치거리
        blockLength, // 1블록 당 거리
        reversDig, // 역방향 굴진 거리
        revers, // 시점/종점 여부
    }) {
        const divisionBlockLeng = blockLength * index; // 거리

        // 사갱 아님
        if (!revers) {
            return deviceLength > blockLength * (index - 1) &&
                deviceLength <= divisionBlockLeng
                ? true
                : forwardLength > 0 && forwardLength <= blockLength
                ? true
                : false;
        } else {
            return reversDig + blockLength >=
                totalLength - blockLength * (index - 1) // 1블럭당 구간이 짧아 1블럭을 기본으로 추가 해준다.
                ? !!(
                      deviceLength < totalLength - blockLength * (index - 1) &&
                      deviceLength > totalLength - divisionBlockLeng
                  )
                : false;
        }
    },
};

export default mapUtils;
