
xcodebuild -scheme BioCheckTest \
       -configuration Release \
       -destination "platform:iOS Simulator, arch:arm64, id:738B65E5-5693-4F42-9D7E-B175E42B587D, OS:18.5, name:iPhone 16 Pro" \
       CODE_SIGNING_ALLOWED=NO \
       build
