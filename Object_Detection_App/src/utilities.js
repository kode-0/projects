export const drawRect = (detections, ctx) =>
{
    detections.forEach(prediction =>
        {
            // getting prediction results
            const[x, y, width, height] = prediction['bbox'];
            const text = prediction['class'];

            // styling
            const color = 'green'
            ctx.strokeStyle = color
            ctx.font = '18 Arial'
            ctx.fillStyle = color

            // Drawing rectangles
            ctx.beginPath()
            ctx.fillText(text, x, y)
            ctx.rect(x, y, width, height)
            ctx.stroke()
                
        })
}