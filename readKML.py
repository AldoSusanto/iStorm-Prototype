##from fastkml import kml
##
##with open(r"C:\Users\Aldo Susanto\Desktop\Learn_SQLite\KML file\BeeCreek100yrInBound - Copy.kml", 'rt', encoding="utf-8") as myfile:
##    doc=myfile.read()
##
##k = kml.KML()
##k.from_string(doc)
##
###print (k.to_string(prettyprint=True))
##
##print (k.to_string())

numOfCoor = 0

def main():
    file = open("BeeCreek100yrInBound.kml","r")
    resultFile = open("coordinates.js", "w")
    counter = 1
    

    for line in file:
        #For each line in the kml file
        line = line.strip()
        if(line[0:13] == "<coordinates>"):
            resultFile.write("var flood" + str(counter) + " = [\n")
            counter = counter + 1
            #We only care about the <coordinates> line because we only need the coordinates
            parseCoordinates(line, resultFile)
            resultFile.write("];\n")
            resultFile.write("\n")
            resultFile.write("\n")

    resultFile.write("var floodList = [")
    for i in range(1, counter):
        if(i == counter-1):
            resultFile.write("flood" + str(i) + " ];\n\n")
        else:        
            resultFile.write("flood" + str(i) +", ")
        
    print(numOfCoor)
    file.close()
    resultFile.close()


def parseCoordinates(line, resultFile):
    global numOfCoor
    coordinates = line[13:-14] #Remove the "<Coordinates>" at the beg and end of line
    index = 0    
    resultLine = "{lat: "
    
    longitude = "" #stores the longitude
    latitude = ""

    counter = 0
    commaCounter = 0
    for iterator in coordinates:
        counter = counter + 1
        if iterator == ",":
            commaCounter = counter - commaCounter
        if iterator == " ": #We check where is the white space, from there, we get the set of coordinates
            coor = coordinates[index:counter-1]
            longitude = coor[0:commaCounter-1]
            latitude = coor[commaCounter:]
            resultLine = "\t" + resultLine + latitude + ", lng: " + longitude + "},"
            index = counter
            commaCounter = counter
            numOfCoor = numOfCoor + 1
            resultFile.write(resultLine + "\n")
            resultLine= "{lat: "

                

    

    
        


main()

