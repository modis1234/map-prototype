import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import mapUtils from './lib_dev/mapUtils';

const MapCompo = styled.div`
    width: 1008px;
    height: 667px;
    background-color: #2e2e2e;
    position: relative;
    background-image: url(/images/map/map_bg.png);
    background-repeat: no-repeat;
    .buttom-box {
        width: 39px;
        height: 39px;
        color: #ffffff;
        background-color: #171717;
        /* opacity: 0.5; */
        font-size: 18px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;

        &:hover {
            cursor: pointer;
            background-color: #000000;
        }
        &.tag-button-box {
            top: 10px;
            left: 10px;
        }
        &.expand-button-box {
            top: 10px;
            left: 959px;
        }
    }
    .map-area {
        width: 100%;
        height: 100%;
        /* position: absolute; */
        /* background-color:#171717; */
        /* opacity: 0.7; */
        /* left: 103px;
        top: 60px; */
        position: static;
        .block {
            position: absolute;
            /* background-color: #fff */
            div {
                position: absolute;
            }
            /* .icon-div {
                width: 30px;
                height: 30px;
            } */
            .worker-icon {
                width: 37px;
                height: 44px;
                top: 79px;
                left: 40px;
                .worker-count-box {
                    position: absolute;
                    top: -24px;
                    left: 22px;
                    background: #171717;
                    color: #fff;
                    width: 22px;
                    height: 22px;
                    text-align: center;
                }
            }
            .vehicle-icon {
                width: 62px;
                height: 52px;
                top: 105px;
                left: 69px;
                .vehicle-count-box {
                    position: absolute;
                    top: -21px;
                    left: 38px;
                    background: #171717;
                    color: #fff;
                    width: 22px;
                    height: 22px;
                    text-align: center;
                }
            }
            .icon-box {
                top: -4px;
                .scanner-icon {
                    right: 132px;
                    top: 0px;
                    .scanner-img {
                        background-image: url(/images/map/scanTag.png);
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 13px;
                        top: 16px;
                        left: 14px;
                    }
                    .scanner-device-box {
                        background-image: url(/images/map/deviceBox.png);
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 18px;
                        top: 28px;
                        left: 16px;
                    }
                }
                .cctv-icon {
                    width: 17px;
                    height: 30px;
                    z-index: 10;
                    /* .cctv-img {
                    background-image: url(/images/map/cctvTag.png);
                    background-repeat: no-repeat;
                    width: 13px;
                    height: 13px;
                    top: 6px;
                    left: 37px; 
                }*/
                    .cctv-device-box {
                        /* background-image: url(/images/map/deviceBox.png); */
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 18px;
                        top: 17px;
                        left: 36px;
                    }
                }
                .sensor-icon {
                    width: 17px;
                    height: 30px;
                    z-index: 9;
                    .sensor-device-box {
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 18px;
                        top: 17px;
                        left: 36px;
                    }
                }
                .phone-icon {
                    width: 20px;
                    height: 30px;
                    z-index: 8;
                    .phone-device-box {
                        background-repeat: no-repeat;
                        width: 87px;
                        height: 36px;
                        background: #000000 0% 0% no-repeat padding-box;
                        bottom: 42px;
                        right: -42px;
                        padding: 3px;
                        .phone-position {
                            position: static;
                            font-family: 'NotoSansCJKkr-Regular';
                            width: 100%;
                            height: 50%;
                            color: #ff0000;
                            font-size: 12px;
                        }
                        .phone-number {
                            font-family: 'NotoSansCJKkr-Regular';
                            width: 100%;
                            height: 50%;
                            color: #d8d8d8;
                            font-size: 12px;
                            position: static;
                        }
                        .tail {
                            background: #000000 0% 0% no-repeat padding-box;
                            border-top: 8px solid #000000;
                            border-left: 7px solid transparent;
                            border-right: 7px solid transparent;
                            top: 42px;
                            left: 24px;
                        }
                    }
                }
                .tts-icon {
                    width: 17px;
                    height: 33px;
                    z-index: 7;
                    .tts-device-box {
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 18px;
                    }
                }
                .wifi-icon {
                    width: 17px;
                    height: 30px;
                    z-index: 6;
                    .wifi-device-box {
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 18px;
                    }
                }
            }
        }
    }
    .entrance-image {
        position: absolute;
        /* &#entrance001 {
            top: 310px;
            left: -10px;
            z-index: 100;
        } */
        &#entrance002 {
            top: -35px;
            left: 586px;
        }
        &#entrance003 {
            top: 387px;
            left: 129px;
            z-index: 100;
        }
        &#entrance004 {
            top: 42px;
            left: 725px;
        }
    }
    .tag-list-box {
        width: 100px;
        height: 105px;
        background-color: #000000;
        border: 1px solid #5e5e5e;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 56px;
        top: 10px;
        ul.tag-list {
            padding-left: 0;
            margin: 0;
            list-style: none;
            width: 65%;
            height: 83px;
            li.list-item {
                margin-bottom: 10px;
                label {
                    margin-left: 5px;
                    color: #ffffff;
                }
                input:hover {
                    cursor: pointer;
                }
            }
        }
    }
`;

const MapContainer = () => {
    const [dig1, setDig1] = useState([]);

    const [first, setFirst] = useState({
        objectId: 1,
        block_length: 100,
        total_length: 1295, // 총 굴진거리
        forward_index: 'loc001', // 정방향 노선 인덱스
        forward_length: 719, // 정방향 굴진거리 (함양 시점 방향)
        forward_dig: 100, // 정방향 진행 굴진거리
        forward_device: {
            cctv: 50, // cctv 설치 위치
            scanner: 5, // 스캐너 설치 위치
        },
        revers_index: 'loc002', // 역방향 노선 인덱스,
        revers_length: 196, // 역방향 굴진거리 (함양 종점 방향)
        revers_dig: 196, // 역방향 진행 굴진거리
        revers_device: {
            cctv: 153, // cctv 설치 위치
            scanner: 0, // 스캐너 설치 위치
        },
        block_amount: 13, // 맵 블록 갯수
        block_image: {
            open: {
                src: 'open.png',
                style: {
                    width: '159px',
                    height: '159px',
                    position: 'relative',
                    left: '-8px',
                    // top: '-2px',
                },
            },
            close: {
                src: 'close.png',
                style: {
                    width: '156px',
                    height: '160px',
                },
            },
            as: [
                {
                    length: 900,
                    block_length: 200,
                    block: {
                        open: '102정거장.png',
                        close: '102정거장.png',
                        style: {
                            // width: '153px',
                            // height: '159px',
                            divStyle: {
                                top: '37px',
                                left: '509px',
                                zIndex: 90,
                            },
                            imgStyle: {},
                        },
                    },
                    worker: {
                        src: '인원-M.png',
                        style: {
                            top: '242px',
                            left: '53px',
                        },
                    },
                    vehicle: {
                        src: '차량-M.png',
                        style: {
                            top: '262px',
                            left: '136px',
                        },
                    },
                    cctv: {
                        src: 'CCTV.png',
                        style: {
                            top: '22px',
                            left: '-3px',
                        },
                    },
                    sensor: {
                        src: 'sensor.png',
                        style: {
                            top: '13px',
                            left: '10px',
                        },
                    },
                    phone: {
                        src: 'phone.png',
                        style: {
                            top: '6px',
                            left: '20px',
                        },
                    },
                    tts: {
                        src: 'TTS.png',
                        style: {
                            top: '-4px',
                            left: '35px',
                        },
                    },
                    wifi: {
                        src: 'WIFI.png',
                        style: {
                            top: '-9px',
                            left: '47px',
                        },
                    },
                },
                {
                    length: 1100,
                    block: {
                        open: 'open.png',
                        close: 'close.png',
                        style: {
                            divStyle: {
                                top: '142px',
                                left: '637px',
                            },
                            imgStyle: {
                                opacity: 0.5,
                            },
                        },
                    },
                },
                {
                    length: 1200,
                    block: {
                        open: 'open.png',
                        close: 'close.png',
                        style: {
                            divStyle: {
                                top: '112px',
                                left: '687px',
                            },
                        },
                    },
                },
                {
                    length: 1300,
                    block: {
                        open: '환기구9.png',
                        close: '환기구9.png',
                        style: {
                            divStyle: {
                                top: '1px',
                                left: '734px',
                            },
                            imgStyle: {
                                position: 'relative',
                                height: '255px',
                                width: '246px',
                            },
                        },
                    },
                    worker: {
                        src: '인원-M.png',
                        style: {
                            top: '138px',
                            left: '48px',
                        },
                    },
                    vehicle: {
                        src: '차량-M.png',
                        style: {
                            top: '190px',
                            left: '110px',
                        },
                    },
                    cctv: {
                        src: 'CCTV-R.png',
                        style: {
                            top: '146px',
                            left: '224px',
                        },
                    },
                    sensor: {
                        src: 'sensor-R.png',
                        style: {
                            top: '139px',
                            left: '210px',
                        },
                    },
                    phone: {
                        src: 'phone-R.png',
                        style: {
                            top: '129px',
                            left: '195px',
                        },
                    },
                    tts: {
                        src: 'TTS-R.png',
                        style: {
                            top: '124px',
                            left: '181px',
                        },
                    },
                    wifi: {
                        src: 'WIFI-R.png',
                        style: {
                            top: '115px',
                            left: '166px',
                            width: '19px',
                        },
                    },
                },
            ],
        },
        is_entry: false, // 진입 지점 유무
        is_shaft: true, // 사갱 지점 유무
        shaft_info: {
            //사갱 정보
            total_length: 280, // 총 굴진거리
            start_point: 800, // 사갱 시작 지점
            end_point: 1100, // 사갱 끝 지점
            forward_index: 'local003', // 정방향 노선 인덱스
            forward_length: 280, // 정방향 굴진거리 (함양 시점 방향)
            forward_dig: 100, // 정방향 진행 굴진거리
            forward_device: {
                cctv: 0, // cctv 설치 위치
                scanner: 0, // 스캐너 설치 위치
            },
            revers_index: 'local004', // 역방향 노선 인덱스,
            revers_length: 0, // 역방향 굴진거리 (함양 종점 방향)
            revers_dig: 0, // 역방향 진행 굴진거리
            revers_device: {
                cctv: 0, // cctv 설치 위치
                scanner: 0, // 스캐너 설치 위치
            },
        },
    });

    const setStateDig1 = (data) => {
        setDig1(data);
    };

    const setRendering = useCallback(
        (initTopPoint, initLeftPoint, items) =>
            mapUtils.rendering(initTopPoint, initLeftPoint, items),
        [dig1],
    );

    useEffect(() => {
        if (dig1.length === 0) {
            mapUtils.bind(first, setStateDig1);
            // bind(first, setStateDig1);
        }
    }, []);

    return (
        <MapCompo>
            <div className="map-area">
                {dig1.length > 0 && setRendering(495, 41, dig1)}
            </div>
        </MapCompo>
    );
};

export default MapContainer;
