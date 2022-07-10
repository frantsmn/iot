import websocket
# from datetime import datetime
from gpiozero import MotionSensor

# websocket.enableTrace(True)
ws = websocket.WebSocket()
ws.connect("ws://localhost:9000", timeout=5, origin="sensor")
# ws.send("Sensor connected")
# print('Message from server > ', ws.recv())
# ws.close()

pir = MotionSensor(4)

while True:
    pir.wait_for_motion()
    # dt = datetime.now()
    # ts = datetime.timestamp(dt)
    # timestamp = str(datetime.timestamp(datetime.now()))
    # print('Motion', timestamp)
    ws.send('1')
