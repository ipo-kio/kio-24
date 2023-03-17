let circuits=[
    {
        name: "0",
        ports: 2,
        centerPorts: 3,
        tests: [...Array(4).keys()],
        elements: [{"name":"not_0","type":"not","pos":{"x":0.21940664375715924,"y":0.2}},{"name":"and_0","type":"and","pos":{"x":0.17672989690721652,"y":0.39444444444444443}},{"name":"and_1","type":"and","pos":{"x":0.3075780068728522,"y":0.6027777777777777}}],
        wires: [{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"not_0","type":"input","id":0}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":0}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_0","type":"input","id":0}},{"startPort":{"element":"and_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":1}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_0","type":"input","id":1}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"and_1","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_1","type":"input","id":1}},{"startPort":{"element":"and_1","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":2}}]
    },

    {
        name: "1",
        ports: 3,
        centerPorts: 4,
        tests: [...Array(8).keys()],
        elements: [],
        wires: []
    },

    {
        name: "2",
        ports: 4,
        centerPorts: 5,
        tests: [...Array(16).keys()],
        elements: [{"name":"and_1","type":"and","pos":{"x":0.2218226068144943,"y":0.29694444444444446}},{"name":"and_3","type":"and","pos":{"x":0.24513250405624662,"y":0.6722222222222223}},{"name":"not_3","type":"not","pos":{"x":0.10406526050117182,"y":0.7069444444444445}},{"name":"and_5","type":"and","pos":{"x":0.37276906435911306,"y":0.3875}},{"name":"not_1","type":"not","pos":{"x":0.0997385974400577,"y":0.31666666666666665}},{"name":"or_0","type":"or","pos":{"x":0.3667297638363079,"y":0.2361111111111111}},{"name":"or_1","type":"or","pos":{"x":0.4392013701099693,"y":0.5583333333333333}},{"name":"and_2","type":"and","pos":{"x":0.10559762033531639,"y":0.5319444444444444}},{"name":"not_0","type":"not","pos":{"x":0.11001442221020373,"y":0.06944444444444445}},{"name":"and_4","type":"and","pos":{"x":0.3295024337479719,"y":0.5097222222222222}},{"name":"not_2","type":"not","pos":{"x":0.22088516315125295,"y":0.4236111111111111}},{"name":"and_0","type":"and","pos":{"x":0.21754664683612765,"y":0.15861111111111115}}],
        wires: [{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"not_0","type":"input","id":0}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":0}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"not_1","type":"input","id":0}},{"startPort":{"element":"not_1","type":"output","id":0},"endPort":{"element":"and_1","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_1","type":"input","id":0}},{"startPort":{"element":"not_0","type":"output","id":0},"endPort":{"element":"and_0","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":1},"endPort":{"element":"and_0","type":"input","id":1}},{"startPort":{"element":"and_0","type":"output","id":0},"endPort":{"element":"or_0","type":"input","id":0}},{"startPort":{"element":"and_1","type":"output","id":0},"endPort":{"element":"or_0","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":0},"endPort":{"element":"and_2","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":2},"endPort":{"element":"and_2","type":"input","id":1}},{"startPort":{"element":"and_2","type":"output","id":0},"endPort":{"element":"not_2","type":"input","id":0}},{"startPort":{"element":"and_2","type":"output","id":0},"endPort":{"element":"and_3","type":"input","id":0}},{"startPort":{"element":"not_3","type":"output","id":0},"endPort":{"element":"and_3","type":"input","id":1}},{"startPort":{"element":"output_bar","type":"output","id":3},"endPort":{"element":"not_3","type":"input","id":0}},{"startPort":{"element":"output_bar","type":"output","id":2},"endPort":{"element":"and_4","type":"input","id":1}},{"startPort":{"element":"not_2","type":"output","id":0},"endPort":{"element":"and_4","type":"input","id":0}},{"startPort":{"element":"and_4","type":"output","id":0},"endPort":{"element":"or_1","type":"input","id":0}},{"startPort":{"element":"or_0","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":1}},{"startPort":{"element":"or_1","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":3}},{"startPort":{"element":"not_2","type":"output","id":0},"endPort":{"element":"and_5","type":"input","id":0}},{"startPort":{"element":"and_5","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":2}},{"startPort":{"element":"and_3","type":"output","id":0},"endPort":{"element":"or_1","type":"input","id":1}},{"startPort":{"element":"and_3","type":"output","id":0},"endPort":{"element":"common_bar","type":"common","id":4}}]
    },
]

export default circuits
