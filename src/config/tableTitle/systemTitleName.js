/**
 * 系统管理
 */
// 无线设备类型管理
export const mainDevTable = [{
            data: '名称',
            name: 'devTypeName',
            width: 160
        },
        {
            data: '型号',
            name: 'specification',
            width: 200
        }, {
            data: '版本',
            name: 'version'
        },
        {
            data: '操作',
            width: 180,
            butname: [{ name: '编辑', btnType: 'primary' }, { name: '删除', btnType: 'danger' }]
        }
    ]
    // 附表
export const fDevTable = [{
        data: '参数名称',
        name: 'paramName',
        width: 120
    },
    {
        data: '编码',
        name: 'paramCode',
        width: 120
    },
    {
        data: '操作',
        butname: [{ name: '编辑', btnType: 'primary' }, { name: '删除', btnType: 'danger' }]
    }
]