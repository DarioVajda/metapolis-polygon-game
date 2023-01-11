import os
message = "// edited by the addingAnimations script!\n"

def editLine(line):
    foundChar = False
    start = -1
    end = -1
    for i in range(0, len(line)):
        if(line[i:i+10] == "material={"):
            start = i + 10
            foundChar = True
        if(foundChar and line[i] == '}'):
            end = i
            break

    if(start == -1 or end == -1):
        return line
    
    newLine = line[0:start] + "opacity.to(o => opacityToMaterial(o, " + line[start:end] + "))" + line[end:len(line)]
    return newLine

def editFile(path):
    f = open(path, 'r')

    newFile = ''
    for line in f:
        newFile = newFile + editLine(line)

    if(newFile[0:len(message)] == message):
        print(message)
        return

    for i in range(0, len(newFile)):
        if(newFile[i:i+5] == "const"):
            newFile = newFile[0:i-1] + "import { MeshStandardMaterial } from 'three'\n\nimport { useSpring } from '@react-spring/three'\nimport { a } from '@react-spring/three'\n\n" + newFile[i:len(newFile)]
            break

    for i in range(0, len(newFile)):
        if(newFile[i:i+6] == "return"):
            newFile = newFile[0:i-1] + "\n  const { opacity } = useSpring({\n    opacity: 1,\n    from: {\n      opacity: 0\n    }\n  })\n  const opacityToMaterial = (opacity, mat) => {\n    // console.log(opacity);\n    // let mat = new MeshStandardMaterial(material);\n    mat.transparent = true;\n    mat.opacity = opacity;\n    return mat;\n  }\n\n  " + newFile[i:len(newFile)]
            break

    newFile = message + newFile

    newFile = newFile.replace("mesh", "a.mesh")

    # print(newFile)
    print("edited file: " + path + "\n")

    fw = open(path, "w")
    fw.write(newFile)


rootdir = "C:/Users/Dario Vajda/OneDrive/Documents/nft/frontend/components/game/modelComponents"
for subdir, dirs, files in os.walk(rootdir):
    for file in files:
        if(file[0:5] == "Theme" and file[len(file)-3:len(file)] == ".js"):
            print(os.path.join(subdir, file))
            editFile(os.path.join(subdir, file))



# TREBALO BI DA RADI, PROVERITI