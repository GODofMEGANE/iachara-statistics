type CharaSheet = {
    id: number,
    icon: string[],
    name: string,
    data: {
        memo: string,
        money: {
            debtMoney: string,
            belongings: {
                id: number,
                name: string,
                price: string,
                detail: string,
                quantity: string,
                unitPrice: string,
            }[],
            pocketMoney: "",
        },
        battle: {
            id: number,
            name: string,
            time: string,
            range: string,
            damage: string,
            detail: string,
            failure: string,
            endurance: string,
            ammoAmount: string,
            probability: string,
        }[],
        spells: {
            id: number,
            memo: string,
            name: string,
        }[],
        fellows: [],
        profile: {
            age: string,
            sex: string,
            tag: string,
            from: string,
            furi: string,
            name: string,
            icons: {
                id: number,
                url: string,
                name: string,
                externalData?: string | null,
            }[],
            height: string,
            isLost: boolean,
            weight: string,
            eyeColor: string,
            hairColor: string,
            skinColor: string,
            profession: string,
            themeColor: string,
            externalData: {},
            externalProfiles: {
                id: string,
                name: string,
                type: string,
                value: string,
                externalData?: string | null,
            }[],
            isLostDisableImg: boolean,
        },
        version: string,
        metadata: {
            created: string,
            authorId: string,
            isPublic: boolean,
            isDeleted: boolean,
            isCopyable: boolean,
            lastUpdated: string,
        },
        abilities: {
            hp: {
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            mp: {
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            app: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            con: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            dex: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            edu: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            ide: {
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            int: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            pow: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            san: {
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            siz: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            str: {
                value: number,
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            know: {
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            luck: {
                fixedDiff: number,
                tmpFixedDiff: number,
            },
            userDB: string,
            sanCurrent: number,
        },
        artifacts: {
            id: number,
            memo: string,
            name: string,
        }[],
        skillPoint: {
            interestPoint: number,
            professionPoint: number,
            fixInterestPoint: number,
            fixProfessionPoint: number,
            professionPointCalcType: number,
        },
        jsonVersion: string,
        actionSkills: {
            static: {
                name: string,
                isGrow: boolean,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName?: string,
                professionPoint: number,
            }[],
            additional: {
                id: string,
                name: string,
                isGrow: boolean,
                sumPoint: number,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName: string,
                professionPoint: number,
            }[]
        },
        battleSkills: {
            static: {
                name: string,
                isGrow: boolean,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName?: string,
                professionPoint: number,
            }[],
            additional: {
                id: string,
                name: string,
                isGrow: boolean,
                sumPoint: number,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName: string,
                professionPoint: number,
            }[]
        },
        searchSkills: {
            static: {
                name: string,
                isGrow: boolean,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName?: string,
                professionPoint: number,
            }[],
            additional: {
                id: string,
                name: string,
                isGrow: boolean,
                sumPoint: number,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName: string,
                professionPoint: number,
            }[]
        },
        knowledgeSkills: {
            static: {
                name: string,
                isGrow: boolean,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName?: string,
                professionPoint: number,
            }[],
            additional: {
                id: string,
                name: string,
                isGrow: boolean,
                sumPoint: number,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName: string,
                professionPoint: number,
            }[]
        },
        negotiationSkills: {
            static: {
                name: string,
                isGrow: boolean,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName?: string,
                professionPoint: number,
            }[],
            additional: {
                id: string,
                name: string,
                isGrow: boolean,
                sumPoint: number,
                otherPoint: number,
                growthPoint: number,
                defaultPoint: number,
                interestPoint: number,
                additionalName: string,
                professionPoint: number,
            }[]
        },
        passedScenatios: {
            id: string,
            memo: string,
            name: string,
        }[],
        additionalMemoIds: string[],
    },
    authorId: string,
    public: boolean,
    tag: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    deleted: boolean
};

type IacharaSheet = CharaSheet[];

type StatisticsAverage = {
    str: number,
    con: number,
    pow: number,
    dex: number,
    app: number,
    siz: number,
    int: number,
    edu: number,
    validNumber: number,
    additional: {
        memoLength: number,
        age: {
            average: number,
            validNumber: number,
        },
        height: {
            average: number,
            validNumber: number,
        },
        sex: {
            maleRate: number,
            femaleRate: number,
            otherRate: number,
            validNumber: number,
        }
    }
};

type SortAndFilterMode = {
    sortBy: {
        priority: number,
        condition: string,
        subCondition: string,
        order: string,
    }[],
    filterBy: {
        condition: string,
        subCondition: string,
        min: number,
        max: number,
    }[]
}