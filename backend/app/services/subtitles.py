from datetime import timedelta

def format_timestamp(seconds):
    td = timedelta(seconds=seconds)
    hours, remainder = divmod(td.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = td.microseconds // 1000
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def generate_srt(chunks):
    srt_output = ""
    for i, chunk in enumerate(chunks, 1):
        start = format_timestamp(chunk["timestamp"][0])
        end = format_timestamp(chunk["timestamp"][1])
        text = chunk["text"].strip()
        srt_output += f"{i}\n{start} --> {end}\n{text}\n\n"
    return srt_output

