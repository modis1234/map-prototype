/* eslint-disable */
/**
 * @function rendering
 * @function bleDataBinding
 * @function deviceBindingHandler
 */
const mapUtils = {
    bind(data, callback) {
        const _this = this;
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
            shaft_entry_point = 0,
            shaft_type_entry: shaftTypeEntry = null,
            shaft_info: shaftInfo = null, // 사갱 정보
            block_image,
        } = data;

        // const blockLength = totalLength / blockAmount; // 1개 블록 당 거리
        const forwardLength = forward_length + blockLength;
        const forwardDig = forward_dig !== 0 ? forward_dig + blockLength : 0;

        const reversLength = revers_length - blockLength;
        const reversDig = revers_dig;
        // const reversDig = 300;

        const shaftEntryPoint = isEntry ? shaft_entry_point + blockLength : 0;

        const shaftStartPoint =
            shaftInfo !== null ? shaftInfo.start_point + blockLength : 0;
        const shaftEndPoint =
            shaftInfo !== null ? shaftInfo.end_point + blockLength : 0;

        let mapArr = [];
        let divisionBlockLeng = 0;
        for (let i = 1; i <= blockAmount; i++) {
            const _asImage = block_image.as.find((blockItem) => {
                const { length } = blockItem;

                if (
                    length >= blockLength * (i - 1) &&
                    length < blockLength * i
                ) {
                    return blockItem;
                }
            });

            const _blockLength =
                _asImage && _asImage?.block_length
                    ? _asImage.block_length
                    : blockLength;
            console.log('asImage-->', _asImage);

            // const divisionBlockLeng =
            //     _asImage && _asImage?.block_length
            //         ? blockLength * (i - 1) + _asImage.block_length
            //         : blockLength * i; // 위치
            divisionBlockLeng =
                _asImage && _asImage?.block_length
                    ? divisionBlockLeng + _asImage.block_length
                    : divisionBlockLeng + _blockLength;

            const _shaft = isShaft
                ? divisionBlockLeng > shaftStartPoint &&
                  divisionBlockLeng < shaftEndPoint
                    ? true
                    : false
                : false;
            const _revers = _shaft
                ? divisionBlockLeng <= shaftEntryPoint
                    ? false
                    : true
                : divisionBlockLeng <= forwardLength
                ? false
                : true;
            const _entry = isEntry
                ? divisionBlockLeng <= shaftEntryPoint &&
                  _blockLength * (i + 1) > shaftEntryPoint
                    ? true
                    : false
                : false;

            const obj = {
                id: i,
                value: i,
                objectId,
                local_index:
                    divisionBlockLeng <= forwardLength
                        ? forwardIndex
                        : reverseIndex,
                total_length: totalLength,
                open: isShaft
                    ? !_revers
                        ? !_shaft
                            ? forwardDig >= divisionBlockLeng
                                ? true
                                : false //시점
                            : shaftInfo.forward_dig > _blockLength * (i - 1) &&
                              shaftInfo.forward_dig + _blockLength <
                                  divisionBlockLeng
                            ? true
                            : shaftEntryPoint - shaftInfo.forward_dig >
                              divisionBlockLeng
                            ? true
                            : false // 사갱 시점 /** 시정방향 **/
                        : !_shaft
                        ? reversDig > totalLength - divisionBlockLeng &&
                          reversLength !== 0
                            ? true
                            : false // 종점
                        : shaftEntryPoint + shaftInfo.revers_dig >
                          divisionBlockLeng
                        ? //   shaftInfo.revers_dig < shaftEndPoint
                          true
                        : false // 사갱 종점 /** 종점방향 **/
                    : // 사갱 있음
                    divisionBlockLeng < forwardLength
                    ? forwardDig >= divisionBlockLeng ||
                      forwardDig === forwardLength
                        ? true // 굴착
                        : forwardDig > 0 && i === 1
                        ? true
                        : false // 미굴착
                    : //정방향 이라면
                    reversDig >= totalLength - _blockLength * (i - 1) ||
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
                    forwardLength: !_revers
                        ? !_shaft
                            ? forwardLength
                            : shaftInfo.forward_length + blockLength
                        : !_shaft
                        ? reversLength
                        : shaftInfo.revers_length - blockLength,
                    deviceLength: !_revers
                        ? !_shaft
                            ? forwardDevice.cctv
                            : shaftInfo.forward_device.cctv
                        : !_shaft
                        ? reversDevice.cctv
                        : shaftInfo.revers_device.cctv,
                    blockLength,
                    reversDig,
                    revers: _revers,
                    shaft: _shaft,
                    shaftEntryPoint,
                    shaftStartPoint,
                }),
                scanner: _this.deviceBindingHandler({
                    index: i,
                    totalLength,
                    forwardLength: !_revers
                        ? !_shaft
                            ? forwardLength
                            : shaftInfo.forward_length + blockLength
                        : !_shaft
                        ? reversLength
                        : shaftInfo.revers_length - blockLength,
                    deviceLength: !_revers
                        ? !_shaft
                            ? forwardDevice.scanner
                            : shaftInfo.forward_device.scanner
                        : !_shaft
                        ? reversDevice.scanner
                        : shaftInfo.revers_device.scanner,
                    blockLength,
                    reversDig,
                    revers: _revers,
                    shaft: _shaft,
                    shaftEntryPoint,
                    shaftStartPoint,
                }),
                revers: _revers,
                dig_length: _revers ? revers_dig : forward_dig,
                shaft: _shaft,
                entry: _entry,
                shaft_start_point: isShaft ? shaftStartPoint : 0,
                shaft_end_point: isShaft ? shaftEndPoint + blockLength : 0,
                shaft_entry_point: isEntry ? shaftEntryPoint : 0,
                shaft_type_entry: isEntry ? shaftTypeEntry : null,
                block_length: blockLength,
                division_length: divisionBlockLeng,
                show: {
                    worker: !_entry ? true : false,
                    vehicle: !_entry ? true : false,
                    cctv: !_entry ? true : false,
                    scanner: !_entry ? true : false,
                    sensor: !_entry ? true : false,
                    phone: !_entry ? true : false,
                    tts: !_entry ? true : false,
                    wifi: !_entry ? true : false,
                },
                block_image,
            };
            mapArr = [...mapArr, obj];
        }
        callback(mapArr);
    },
    rendering(initTopPoint, initLeftPoint, items, isExpand = false) {
        return (
            <>
                {items.map((item, index, arr) => {
                    // console.log('item-->', item);
                    const {
                        objectId,
                        shaft,
                        revers,
                        value,
                        division_length,
                        shaft_type_entry,
                        entry,
                        open,
                        block_image,
                    } = item;

                    // const _openImage = block_image?.open
                    //     ? block_image.open.src
                    //     : 'open.png';

                    const _asImage = block_image.as.find((blockItem) => {
                        const { length } = blockItem;
                        const calaBLength = length + item.block_length;
                        if (
                            (arr[index - 1] &&
                                calaBLength > arr[index - 1].division_length &&
                                calaBLength <= division_length) ||
                            (!arr[index + 1] &&
                                calaBLength > arr[index - 1].division_length) ||
                            (!arr[index - 1] && calaBLength < item.block_length)
                        ) {
                            console.log('-->', item);
                            return blockItem;
                        }

                        // if (
                        //     arr[index + 1] &&
                        //     calaBLength > division_length &&
                        //     calaBLength < arr[index + 1].division_length
                        // ) {
                        //     console.log('division_length-->', division_length);
                        //     console.log(
                        //         'arr[index + 1]-->',
                        //         arr[index + 1].division_length,
                        //     );
                        //     console.log('item-->', item);
                        //     return blockItem;
                        // }
                    });

                    console.log(_asImage);

                    let _topMove = -31;
                    let _leftMove = 53;

                    const _blockStyled =
                        _asImage && _asImage.block.style?.divStyle
                            ? {
                                  top: `${initTopPoint + _topMove * index}px`,
                                  left: `${
                                      initLeftPoint + _leftMove * index
                                  }px`,
                                  zIndex: `${99 - objectId - index}`,
                                  // backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  ..._asImage.block.style.divStyle,
                              }
                            : {
                                  top: `${initTopPoint + _topMove * index}px`,
                                  left: `${
                                      initLeftPoint + _leftMove * index
                                  }px`,
                                  zIndex: `${99 - objectId - index}`,
                                  // backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              };

                    const _openImage = _asImage
                        ? _asImage.block.open
                        : block_image?.open
                        ? block_image.open.src
                        : 'open.png';

                    const _closeImage = _asImage
                        ? _asImage.block.close
                        : block_image?.close
                        ? block_image.close.src
                        : 'close.png';

                    // const _imgStyled = {
                    //     width: !isExpand ? '141px' : '241px',
                    //     height: !isExpand ? '162px' : '218px',
                    // };

                    const _imgStyled =
                        _asImage && _asImage.block.style?.imgStyle
                            ? _asImage.block.style.imgStyle
                            : open
                            ? block_image.open.style
                            : block_image.close.style;

                    const workerStyled =
                        _asImage && _asImage?.worker
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage.worker.src}")`,
                                  ..._asImage.worker.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: shaft
                                      ? revers
                                          ? 'url("/images/map/icon/workerFor.png")'
                                          : 'url("/images/map/icon/workerRev.png")'
                                      : revers
                                      ? 'url("/images/map/icon/workerRev.png")'
                                      : 'url("/images/map/icon/workerFor.png")',
                                  backgroundRepeat: 'no-repeat',
                              };

                    const vehicleStyled =
                        _asImage && _asImage?.vehicle
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage?.vehicle.src}")`,
                                  ..._asImage.vehicle.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: shaft
                                      ? revers
                                          ? 'url("/images/map/icon/vehFor.png")'
                                          : 'url("/images/map/icon/vehRev.png")'
                                      : revers
                                      ? 'url("/images/map/icon/vehRev.png")'
                                      : 'url("/images/map/icon/vehFor.png")',
                                  backgroundRepeat: 'no-repeat',
                              };
                    const cctvStyled =
                        _asImage && _asImage?.cctv
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage?.cctv.src}")`,
                                  ..._asImage.cctv.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: `url(/images/map/icon/CCTV.png)`,
                                  top: '18px',
                                  left: '-23px',
                              };

                    const sensorStyled =
                        _asImage && _asImage?.sensor
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage?.sensor.src}")`,
                                  ..._asImage.sensor.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: `url(/images/map/icon/sensor.png)`,
                                  top: '10px',
                                  left: '-11px',
                              };
                    const phoneStyled =
                        _asImage && _asImage?.phone
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage?.phone.src}")`,
                                  ..._asImage.phone.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: `url(/images/map/icon/phone.png)`,
                                  top: '4px',
                                  left: '-2px',
                              };
                    const ttsStyled =
                        _asImage && _asImage?.tts
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage?.tts.src}")`,
                                  ..._asImage.tts.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: `url(/images/map/icon/tts.png)`,
                                  top: '-6px',
                                  left: '12px',
                              };
                    const wifiStyled =
                        _asImage && _asImage?.tts
                            ? {
                                  backgroundImage: `url("/images/map/icon/${_asImage?.wifi.src}")`,
                                  ..._asImage.wifi.style,
                                  backgroundRepeat: 'no-repeat',
                              }
                            : {
                                  backgroundImage: `url(/images/map/icon/wifi.png)`,
                                  top: '-10px',
                                  left: '23px',
                              };

                    return (
                        <div
                            className="block"
                            id={`block-${value}`}
                            key={`tableRowKey${index}`}
                            style={_blockStyled}
                            value={division_length}
                        >
                            <img
                                src={`/images/map/${
                                    open ? _openImage : _closeImage
                                }`}
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
                            <div className="icon-box">
                                {item.show.scanner &&
                                    open &&
                                    item.scanner && (
                                        <div className="scanner-icon">
                                            <div
                                                className="scanner-img"
                                                style={scannerStyled}
                                            ></div>
                                            <div className="scanner-device-box"></div>
                                        </div>
                                    )}{' '}
                                {item.show.cctv && open && item.cctv && (
                                    <div
                                        className="cctv-icon"
                                        style={cctvStyled}
                                    >
                                        <div className="cctv-device-box"></div>
                                    </div>
                                )}
                                {item.show.sensor && open && item.sensor && (
                                    <div
                                        className="sensor-icon"
                                        style={sensorStyled}
                                    >
                                        <div className="sensor-device-box"></div>
                                    </div>
                                )}
                                {item.show.phone && open && item.phone && (
                                    <div
                                        className="phone-icon"
                                        style={phoneStyled}
                                    >
                                        <div className="phone-device-box">
                                            <div className="phone-position">{`위치:${15}m`}</div>
                                            <div className="phone-number">
                                                070-9999-0015
                                            </div>
                                            <div className="tail"></div>
                                        </div>
                                    </div>
                                )}
                                {item.show.tts && open && item.tts && (
                                    <div className="tts-icon" style={ttsStyled}>
                                        <div className="tts-device-box"></div>
                                    </div>
                                )}
                                {item.show.wifi && open && item.wifi && (
                                    <div
                                        className="wifi-icon"
                                        style={wifiStyled}
                                    >
                                        <div className="wifi-device-box"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
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
                                scn_kind === 4 ? item.dig_length : scn_pos_x;
                            if (
                                // positionLeng > blockLength &&
                                positionLeng <=
                                blockLength * (index + 1)
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
    deviceBindingHandler(
        index, // 현재 인덱스
        totalLength, // 총 굴진 거리
        forwardLength, // 정방향 굴진거리
        deviceLength, // 디바이스 설치거리
        blockLength, // 1블록 당 거리
        reversDig, // 역방향 굴진 거리
        shaftEntryPoint = 0, // 사갱 진입 지점
        revers, // 시점/종점 여부
        shaft, // 사갱/횡갱 존재 여부
    ) {
        const divisionBlockLeng = blockLength * index; // 거리

        if (shaft) {
            const _shaftEntryPoint = shaftEntryPoint;
            // 사갱
            if (!revers) {
                // 정방향(시점)
                return _shaftEntryPoint > divisionBlockLeng
                    ? divisionBlockLeng * deviceLength !== 0
                    : false;
            }
            // 역방향(종점)
            return !!(
                _shaftEntryPoint + deviceLength > divisionBlockLeng &&
                _shaftEntryPoint + deviceLength < blockLength * (index + 1)
            );
        }
        // 사갱 아님
        if (!revers) {
            return !!(
                deviceLength > blockLength * (index - 1) &&
                deviceLength <= divisionBlockLeng
            );
        }
        return reversDig + blockLength >=
            totalLength - blockLength * (index - 1) // 1블럭당 306m로 구간이 짧아 1블럭을 기본으로 추가 해준다.
            ? !!(
                  deviceLength < totalLength - blockLength * (index - 1) &&
                  deviceLength > totalLength - divisionBlockLeng
              )
            : false;
    },
};

export default mapUtils;
