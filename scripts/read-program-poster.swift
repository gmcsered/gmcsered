import AppKit
import Foundation
import ImageIO
import Vision

struct RecognizedText: Encodable {
  let text: String
  let x: Double
  let y: Double
  let width: Double
  let height: Double
}

enum PosterReaderError: Error, LocalizedError {
  case missingPath
  case unreadableImage(String)
  case missingCgImage(String)

  var errorDescription: String? {
    switch self {
    case .missingPath:
      return "Chýba cesta k plagátu."
    case .unreadableImage(let path):
      return "Plagát sa nedá otvoriť: \(path)"
    case .missingCgImage(let path):
      return "Plagát sa nedá spracovať: \(path)"
    }
  }
}

func main() throws {
  guard CommandLine.arguments.count == 2 else {
    throw PosterReaderError.missingPath
  }

  let path = CommandLine.arguments[1]
  guard let image = NSImage(contentsOfFile: path) else {
    throw PosterReaderError.unreadableImage(path)
  }

  guard let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    throw PosterReaderError.missingCgImage(path)
  }

  let request = VNRecognizeTextRequest()
  request.recognitionLevel = .accurate
  request.usesLanguageCorrection = true
  request.recognitionLanguages = ["sk-SK", "en-US"]
  request.minimumTextHeight = 0.012

  let handler = VNImageRequestHandler(cgImage: cgImage, orientation: .up)
  try handler.perform([request])

  let texts = (request.results ?? []).compactMap { observation -> RecognizedText? in
    guard let candidate = observation.topCandidates(1).first else {
      return nil
    }

    let box = observation.boundingBox
    return RecognizedText(
      text: candidate.string,
      x: Double(box.midX),
      y: Double(box.midY),
      width: Double(box.width),
      height: Double(box.height)
    )
  }

  let encoder = JSONEncoder()
  encoder.outputFormatting = [.sortedKeys]
  let output = try encoder.encode(texts)
  FileHandle.standardOutput.write(output)
  FileHandle.standardOutput.write(Data("\n".utf8))
}

do {
  try main()
} catch {
  let message = error.localizedDescription + "\n"
  FileHandle.standardError.write(Data(message.utf8))
  exit(1)
}
